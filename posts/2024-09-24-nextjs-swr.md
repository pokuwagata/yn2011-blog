---
title: 業務で SWR を利用して新規プロダクトを開発した
date: 2024-09-24
public: true
---

# 業務で SWR を利用して新規プロダクトを開発した

2023 ~ 2024 年にかけて業務で新規プロダクトを開発した。その際の技術スタックやディレクトリ構成については、[フロントエンドのディレクトリ設計 (Next.js Pages Router)](https://blog.yn2011.com/posts/2024-08-23-nextjs-fe-directory) で紹介した。

また、ErrorBoudary と Suspense の利用については [業務で ErrorBoundary と Suspense を利用して新規プロダクトを開発した](https://blog.yn2011.com/posts/2024-08-27-nextjs-swr-suspense) という記事で紹介した。

この記事では、同じプロダクトで [SWR](https://swr.vercel.app/ja) をどのように利用したかの詳細を紹介する。

なお、この記事のサンプルコードのファイルパスは上記の記事のディレクトリ構成に対応している。

## Suspense モード

SWR には `suspense` という[オプション](https://swr.vercel.app/ja/docs/suspense)がある。このオプションを `true` にしている状態をこの記事では Suspense モードと呼ぶ。

Suspense モードでは `useSWR` フックを呼び出すと Promise を throw するので Suspense を利用してローディング中の Fallback UI を実装できる。

Suspense はデータフェッチングライブラリでの使用は推奨されておらず、フレームワークレベルでのサポートが必要とされている。例えば Next.js Pages Router で Suspense を使う場合、その Component を SSR すると Hydration エラーが発生する可能性がある。

とはいえ、以下の理由から今回は `suspense` オプションを有効にして開発した。

- 今後の React / Next.js では Suspense を活用していくことになる
- ErrorBoundary との親和性（各 Component で `if(err) throw err;` しなくて良い）

したがってほとんどの Component を SSR させないように (CSR するように) 実装した。

そもそも、今回のプロダクトでは要件とその他の都合からページの大部分は CSR が必要だったので、Suspense のためだけに CSR するわけではなく、いずれにしろ同じだったという背景もある。

以下では Suspnese モードの前提でどのように SWR を利用したかについて書いていく（とはいえ、Suspense モード特有の内容は少ない）

## Custom Hooks

SWR では `useSWR` という Hook が提供されているが、今回の開発では必ず API ごとに Custom Hooks を実装した。例えば、`/api/user` というパスに GET リクエストを行う場合は、以下のような Hook を実装する。

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

実装の実体は `useCustomSWR` という共通処理に切り出している。どの Hook もこの共通処理から API リクエストを行う。

Custom Hooks として実装する理由は 2 つある。API リクエスト時の処理を共通化することで変更容易性が高まること。また、テストコードで Hook を関数としてモックできるのでテスト容易性が高まるためだ。

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

## Custom Fetcher

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

## POST リクエスト

ここまでは GET リクエストの例について見てきたので、次に POST リクエストの場合について書く。

POST メソッドによる API リクエストは、特に共通処理を切り出すことはしなかった。ただし、こちらも Custom Hooks として実装している。

例えば何らかのデータを更新する `/data/update` API に POST リクエストを行う Hook は以下のような実装になる。

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

## 重複排除

SWR には[重複排除(deduping)](https://swr.vercel.app/ja/docs/advanced/performance#%E9%87%8D%E8%A4%87%E6%8E%92%E9%99%A4)という機能があり、一定時間内の同一 URL に対するリクエストは自動的に 1 つにまとめられる。

これにより、複数の Component が同時に同一の URL に対してリクエストを送信する実装をしたとしても、フロントエンド・バックエンド共にパフォーマンス上の問題はなくなる。これまでは複数の Component が API のレスポンスを共有したい場合は親 Component で取得したレスポンスを State 経由で Props に渡したり、Context で共有したりしてきた。

Props で渡す場合は、以下の課題があった。

- 親 Component からレスポンスを渡される子 Component は、暗黙的に特定の API に依存していることになる（コロケーションが失われると言うらしい）
- API レスポンスに依存しない子 Component も親 Component の `setState` により re-render 対象になる（`React.memo` で回避は可能）
- 子 Component は親 Component の API リクエストが完了するまでマウントされない or ローディング表示の実装が必要

Context で共有する場合は `useContext` により API とのコロケーションは失われないが、残りの課題はなお残る。また、どちらも Suspense により子 Component のローディング表示を宣言的に実装できない。

SWR の重複排除により複数の子 Component が、単に `useSWR` を呼び出すだけで API レスポンスを取得し共有できるので積極的に活用している（そして SWR は Suspense にも対応している）

開発したプロダクトでは同一の API に対して 3 ~ 4 個の Component が初期表示時に CustomHooks 経由で `useSWR` を呼び出しているケースもある。

## 課題

全体として大きな課題はなかったが、少し気になった部分もあった。

### Suspense と ErrorBoundary が増えすぎる

`useSWR` Hook を呼び出した Component に Fallback UI とエラーハンドリングが必要な場合、必ず Suspense と ErrorBoundary をセットで実装しないといけない。上記に書いたように同一の API を 3 ~ 4 個の Component がリクエストする場合に各コンポーネントに Suspense と ErrorBoundary を実装しなければいけないのは少し煩わしさがあった。

特に、ErrorBoundary の処理が数行の場合は、単純に 1 つの Component 内で実装してしまった方が分かりやすいのでは、と感じる場合もあるかもしれない。

そもそも各 Component ごとに ErrorBoundary の実装が必要になる背景としては、認証エラーのレスポンスを Error として throw していることも関係している。未ログイン画面を描画する場合に各コンポーネントで上位の ErrorBoundary に throw するのではなく、自身を非表示にするために `<></>` をレンダリングする必要がある（ような UI だった）。したがって各 Component ごとに ErrorBoundary の実装が必要なことが多かった。そういう事情がなければ ErrorBoundary を多く実装することにはならないかもしれない。

`useSWR` Hook の呼び出しごとに、Suspense オプションを切り替えて false にできるので、実装が単純なら ErrorBoundary を使わず Component 内の実装で完結させてしまう手もある。そうではなく、多少煩わしくてもコードベース全体で ErrorBoundary は必ず使うというルールに統一するべきなのか、これは考えが分かれるかもしれない。

### Suspnese モードでも `useSWR` が返す data の型が `Data | undefined` になってしまう

Suspense モードの場合、リクエスト中はレンダリングが中断されているし、エラーの場合は ErrorBoundary が処理するので data が `undefined` になることはないが、SWR の型定義が対応していない。

今回はほとんどの API を Conditonal Fetching でリクエストしているので、Suspense モードだとしてもリクエストが実行されなければ data が `undefined` になる。この場合、`Data | undefined` は正しい型なのであまり問題にはならなかった。

例えば、リクエストを行う条件が認証用トークンを Cookie に持っているかどうかだとすると、data が `undefined` ならばリクエストされなかった＝未ログインとして扱う必要がある。その場合は未ログイン時の Component を返す実装が必要になり、そのことを型定義が示してくれるので `Data | undefined` という型はむしろ有用だった。

だが、Conditional Fetching しない場合は実際には `undefined` にならない data の型の取り扱いが面倒になる。独自の型定義で回避も可能だが、一部で Conditional Fetching も行っている場合はより煩雑になりそうだ（参考：[SWR の Suspense モードの型を調べる](https://zenn.dev/tnyo43/scraps/259073ef8271ed)）
