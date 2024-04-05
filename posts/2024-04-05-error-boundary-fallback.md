---
title: react-error-boundary の fallbackRender と FallbackComponent の違い
date: 2024-04-05
public: true
---

# react-error-boundary の fallbackRender と FallbackComponent の違い

## react-error-bounadry

React [ErrorBoundary](https://ja.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) は Class Component で実装する必要がある。
[react-error-bounadry](https://www.npmjs.com/package/react-error-boundary) は React の ErrorBoundary を Functional Component で実装するためのライブラリである。

## fallbackRender

react-error-boundary の `fallbackRender` を利用して、以下のように ErrorBoundary を実装できる。

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallbackRender={() => <p>Error Boundary</p>}>
  <SomeComponent />
</ErrorBoundary>;
```

上記の `<SomeComponent>` で例外を throw すると `fallbackRender` に渡された関数（`type '(props: FallbackProps) => ReactNode'`）を実行する。
以下のように直接 Functional Component に Component を渡すと型定義エラーが発生する。

```tsx
import { useEffect } from 'react';
import { ErrorBoundary } from "react-error-boundary";

function Fallback() {
  return <p>Error Boundary</p>;
}

<ErrorBoundary fallbackRender={Fallback}>
  <SomeComponent />
</ErrorBoundary>;
```

なお、`<ErrorBoundary fallbackRender={<Fallback />}>` も同様に型定義エラーになる。

以下のように修正すると動作する。

```tsx
<ErrorBoundary fallbackRender={() => <Fallback />}>
```

## FallbackComponent

react-error-boundary には、`fallbackRender` とは別に `FallbackComponent` という Props が存在する。

`FallbackComponent` を利用して、以下のように ErrorBoundary を実装できる。

```tsx
import { useEffect } from 'react';
import { ErrorBoundary } from "react-error-boundary";

function Fallback() {
  useEffect(() => {
    console.log("hello");
  }, []);

  return <p>Error Boundary</p>;
}

<ErrorBoundary fallbackComponent={Fallback}>
  <SomeComponent />
</ErrorBoundary>;
```

`FallbackComponent` には Component を直接渡せるので React の Hook や Context を利用できる。

Props を渡すためには、以下のように実装する。

```tsx
<ErrorBoundary FallbackComponent={() => <Fallback text={"hoge"} />}>
```

## 経緯

結局、`fallbackRender` と `FallbackComponent` で同じことが実現できるのに、なぜ react-error-boundary は 2 つの Props を定義したのだろうか。

[Provide extra props to fallback component](https://github.com/bvaughn/react-error-boundary/issues/26) によると、`FallbackComponent` は Props として最初から存在していたことが分かる。

詳細は分からないが、Component に独自の Props を渡す上で、より適切な命名の Props として `fallbackRender` が実装されたという経緯のように解釈できた。

## 使い分け

react-error-boundary を使う上では以下のように使い分けることにしている。

- react-error-boundary 由来の Props だけを fallback の Component に渡す→`FallbackComponent`
- その他の Props も渡したい→`fallbackRender`
