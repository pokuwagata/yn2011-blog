---
title: ErrorBoundary, Suspense, SWR を利用して API リクエスト、Fallback UI、エラーハンドリングを実装した
date: 2024-08-27
public: true
---

# ErrorBoundary, Suspense, SWR を利用して API リクエスト、Fallback UI、エラーハンドリングを実装した

2023 ~ 2024 年にかけて業務で新規プロダクトを開発した。その際の技術スタックやディレクトリ構成については、[フロントエンドのディレクトリ設計 (Next.js Pages Router)](https://blog.yn2011.com/posts/2024-08-23-nextjs-fe-directory) で紹介した。この記事では、同じプロダクトで [Suspense](https://react.dev/reference/react/Suspense) と [SWR](https://swr.vercel.app/ja) を利用して API リクエスト、Fallback UI、エラーハンドリングをどのように実装したのかについて書く。

なお、この記事のサンプルコードのファイルパスは上記の記事のディレクトリ構成に対応している。

## ErrorBoundary と Suspense

API リクエストをする Component は ErrorBoundary と Suspense を利用して以下のように実装した。

```tsx:features/detail/components/Detail.tsx
export function Detail() {
  const { isSSR } = useIsSSR();

  return (
    <>
      <Header>ページタイトル</Header>
      <main className={styles.main}>
        {!isSSR && ( // ⭐ 後述
          <ErrorBoundary FallbackComponent={DetailFallbackComponent}>
            <Suspense fallback={<Loading />}>
              <Content /> {/* ⭐ API リクエスト */}
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </>
  );
}
```

### ErrorBoundary

ErrorBoundary を利用して、`_app.tsx` で 共通エラー処理を実装した。共通エラー処理とは、例えば API レスポンスがステータスコード 500 だった場合等の処理のことを指している。

共通ではなく、ページに固有のエラー処理は個別の ErrorBoundary で実装した。例えば、以下の仕様を実装するとする。

- ユーザ認証が必要な API へリクエストする
- 認証エラーのレスポンスが返ってきた場合、未ログイン画面を表示する

以下のように ErrorBoundary でレスポンスごとにレンダリングする Component を分岐する。

```tsx:features/detail/components/DetailFallback.tsx
export function DetailFallback({ error }: Props) {
  if (error?.code === 102) { // 認証エラー時のエラーコードを 102 とする設計
    return <NotLogin />;
  }

  throw error;
}
```

API の設計として、エラーレスポンスにアプリケーション固有のエラーコードを含めているため、クライアントではエラーコードを元にエラー処理の分岐を実装している。

どの条件にも当てはまらないエラーの場合は上位の ErrorBoundary に処理を委ねるため throw する。

### Suspense

今回開発したプロダクトではページの大部分を API レスポンスによって CSR するため、API リクエスト中はローディングスピナー等の Fallback UI を表示する。`useState` や SWR の `isLoading` を使って命令的に実装できるが、Suspense を使うことでより React らしく宣言的に実装できる。

Suspene を使った API リクエストは SWR を使って実装している。Suspense を使うため SWR の `suspense` オプションをデフォルトで true にしている。

ちなみに、上記のコードで `isSSR` フラグによりクライアントサイドでのみ Component をマウントしているのは SWR の Conditional Fetching を使っているため。この点については[以前に記事を書いた](https://blog.yn2011.com/posts/2023-10-27-swr-request-hydration-errror)ので今回の記事では説明を割愛する。

## SWR

API のリクエストには SWR を利用している。SWR を使ってどのように API リクエストを実装しているかについて書く。

### GET リクエスト

API リクエストは必ず API ごとに Custom Hooks を実装する。例えば、`/api/user` というパスにリクエストを行う場合は、以下のような Hooks を実装する。

```ts:features/detail/hooks/useUserInfo.ts
import useSWR from "swr";

import { useCustomSWR } from "~/hooks/useCustomSWR";
import { UserInfoResponse } from "~/types/openapi.schemas";

export function useUserInfo(
  id: number,
  options?: Parameters<typeof useSWR<UserInfoResponse>>[2],
) {
  return useCustomSWR<UserInfoResponse>(`user?id=${id}`, options);
}
```

実装の実体は `useCustomSWR` という共通処理に切り出している。どの Hooks もこの共通処理から API リクエストを行う。

Custom Hooks として実装することで変更容易性が高まる。また、テストコードで関数としてモックできるのでテスト容易性も高まる。

その他工夫している点は以下の通り。

- OpenAPI から自動生成した API レスポンスの型を使って Hooks の返り値を定義（上記のコードの `UserInfoResponse` 型）
- SWR のオプションも引数として受け取ることで再利用性を高める（例えば、特定のコードからは `suspense` オプションを false にしてリクエストすることも可能になる）

共通処理として切り出した `useCustomSWR` は以下のように実装している。

```ts:hooks/useCustomSWR.ts
import Cookies from "js-cookie";
import useSWR from "swr";

import { APIError } from "~/lib/APIError";
import { fetcher } from "~/lib/fetcher";

export function useCustomSWR<T extends object>(
  url: string,
  options?: Parameters<typeof useSWR<T>>[2],
) {
  return useSWR<T, APIError>(
    () => {
      if (Cookies.get("AuthToken")) { // ⭐ 認証用の Token が Cookie に存在しない場合はリクエストしない
        return url;
      }

      return null;
    },
    fetcher, // ⭐ 後述
    options,
  );
}
```

`useCustomSWR` の `fetcher` は以下のように実装している。

```ts:lib/fetcher.ts
import { APIError } from "./APIError";

export async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(`${process.env.apiUrl}/${url}`, {
    credentials: "include",
    ...options,
  });
  const json = await res.json();

  if (!res.ok) {
    const error = new APIError(res.status, json.error.code, json.error.message);

    throw error;
  }

  return json;
}
```

`res.ok` が false（API レスポンスのステータスコードが 200 - 299 以外）だった場合は独自に実装した API エラークラスのインスタンスを生成して throw する。

API エラークラスを導入した理由は API エラーとそれ以外のエラーを区別したいのと、独自のエラーコードをクライアントサイドで扱いやすい形にするためである。

`fetch` メソッドのオプションを受け取れるようにすることで、後述の POST メソッドによるリクエストの場合にも再利用できるようにしている。

### POST リクエスト

POST メソッドによる API リクエストは、特に共通処理を切り出すことはしなかった。ただし、こちらも Custom Hooks として実装している。

例えば以下のような実装になる。

```tsx:features/detail/hooks/useDataUpdate.ts
import useSWRMutation from "swr/mutation";

import { fetcher } from "~/lib/fetcher";
import { SuccessResponse } from "~/types/openapi.schemas";

export function useDataUpdate(id: number) {
  return useSWRMutation<SuccessResponse>(
    "data/update",
    async (url: string) => {
      return await fetcher(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id }),
      });
    },
  );
}
```

`fetcher` は GET メソッドによるリクエストと同じ実装を使用している。

### 重複排除

SWR には[重複排除(deduping)](https://swr.vercel.app/ja/docs/advanced/performance#%E9%87%8D%E8%A4%87%E6%8E%92%E9%99%A4)という機能があり、一定時間内の同一 URL に対するリクエストは自動的に 1 つにまとめられる。

これにより、複数の Component が同時に同一の URL に対してリクエストを送信する実装をしたとしても、フロントエンド・バックエンド共にパフォーマンス上の問題はなくなる。これまでは複数の Component が API のレスポンスを共有したい場合は親 Component で取得したレスポンスを State 経由で Props に渡したり、Context で共有したりしてきた。

Props で渡す場合は、以下の課題があった。

- 親 Component からレスポンスを渡される子 Component は、暗黙的に特定の API に依存していることになる（コロケーションが失われると言うらしい）
- API レスポンスに依存しない子 Component も親 Component の `setState` により re-render 対象になる
- 子 Component は親 Component の API リクエストが完了するまでマウントされない or ローディング表示の実装が必要

Context で共有する場合は `useContext` により API とのコロケーションは失われないが、残りの課題はなお残る。また、どちらも Suspense により子 Component のローディング表示を宣言的に実装できない。

SWR の重複排除により複数の子 Component が、単に `useSWR` を呼び出すだけで API レスポンスを取得し共有できるので積極的に活用している（そして SWR は Suspense にも対応している）

開発したプロダクトでは同一の API に対して 3 ~ 4 個の Component が初期表示時に CustomHook 経由で `useSWR` を呼び出しているケースもある。

## 課題

全体として大きな課題はなかったが、少し気になった部分もあった。

`useSWR` Hook を呼び出した Component に Fallback UI とエラーハンドリングが必要な場合、必ず Suspense と ErrorBoundary をセットで実装しないといけない。上記に書いたように同一の API を 3 ~ 4 個の Component がリクエストする場合に各コンポーネントに Suspense と ErrorBoundary を実装しなければいけないのは少し煩わしさがあった。

特に、ErrorBoundary の処理が数行の場合は、単純に 1 つの Component 内で実装してしまった方が分かりやすいのでは、と感じる場合もあるかもしれない。

そもそも各 Component ごとに ErrorBoundary の実装が必要になる背景としては、認証エラーのレスポンスを Error として throw していることも関係している。未ログイン画面を描画する場合に各コンポーネントで上位の ErrorBoundary に throw するのではなく、自身を非表示にするために `<></>` をレンダリングする必要がある（ような UI だった）。したがって各 Component ごとに ErrorBoundary の実装が必要なことが多かった。そういう事情がなければ ErrorBoundary を多く実装することにはならないかもしれない。

`useSWR` Hook の呼び出しごとに、Suspense オプションを切り替えて false にできるので、実装が単純なら ErrorBoundary を使わず Component 内の実装で完結させてしまう手もある。そうではなく、多少煩わしくてもコードベース全体でルールを統一するべきなのか、これは考えが分かれるかもしれない。

## まとめ

ErrorBoundary, Suspense, SWR を利用して API リクエスト、Fallback UI、エラーハンドリングを良い感じに実装できた。
