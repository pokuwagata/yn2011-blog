---
title: 業務で ErrorBoundary と Suspense を利用して新規プロダクトを開発した
date: 2024-08-27
public: true
---

# 業務で ErrorBoundary と Suspense を利用して新規プロダクトを開発した

2023 ~ 2024 年にかけて業務で新規プロダクトを開発した。その際の技術スタックやディレクトリ構成については、[フロントエンドのディレクトリ設計 (Next.js Pages Router)](https://blog.yn2011.com/posts/2024-08-23-nextjs-fe-directory) で紹介した。この記事では、同プロダクトで ErrorBoundary と Suspene をどのように利用したかを紹介する。

なお、この記事のサンプルコードのファイルパスは上記の記事のディレクトリ構成に対応している。

## ErrorBoundary

API リクエストのエラーハンドリングを ErrorBoundary を利用して実装した。

具体的には以下のようなコードを実装した（コード中の `isSSR` というフラグについては Suspense の項で説明する）

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

まず、今回の開発ではエラーハンドリングを以下の 2 つに分類した。

- プロダクト全体で共通の処理
- ページに固有の処理

プロダクト全体で共通のエラーハンドリングとは、例えば API レスポンスがステータスコード 500 だった場合に共通のエラー画面を用意する場合だ。共通のエラーハンドリングは、`_app.tsx` に実装した。

```tsx:pages/_app.tsx
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // ...
  return (
    // ...
    <ErrorBoundary FallbackComponent={Error}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

ページに固有のエラーハンドリングとは、そのページにだけ存在する要件に関するものだ。ページの固有のエラーハンドリングは、`pages` 直下で import する Component に実装した。

ErrorBoudanry では、API レスポンスのエラーコードを元に処理を分岐した。例えば以下のように、レスポンスごとにレンダリングする Component を分岐する。

```tsx:features/detail/components/DetailFallback.tsx
export function DetailFallback({ error }: Props) {
  if (error?.code === 102) { // 認証エラー時のエラーコードを 102 とする設計
    return <NotLogin />;
  }

  throw error;
}
```

API の設計として、エラーレスポンスにアプリケーション固有のエラーコードを含めているため、クライアントではエラーコードを元にエラー処理の分岐を実装できている。

どの条件にも当てはまらないエラーの場合は上位の ErrorBoundary に処理を委ねるため throw する。

## Suspense

今回開発したプロダクトではページの大部分を API レスポンスによって CSR するため、API リクエスト中はローディングスピナー等の Fallback UI を表示する。これは `useState` や SWR の `isLoading` を使って命令的に実装できるが、Suspense を使うことでより React らしく宣言的に実装できる。

Suspene を使った API リクエストは SWR を使って実装している。Suspense を使うため SWR の `suspense` オプションをデフォルトで true にしている。SWR についての詳細は [業務で SWR を利用して新規プロダクトを開発した](https://blog.yn2011.com/posts/2024-09-24-nextjs-swr) という記事にまとめている。

記事の冒頭のサンプルコードで `isSSR` フラグによりクライアントサイドでのみ Component をマウントしている理由は Hydration エラーの回避のためだ。この点については[以前に記事を書いた](https://blog.yn2011.com/posts/2023-10-27-swr-request-hydration-errror)ので詳細はそちらを参照。
