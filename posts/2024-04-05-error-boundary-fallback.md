---
title: react-error-boundary の fallbackRender と FallbackComponent の違い
date: 2024-04-05
public: true
---

# react-error-boundary の fallbackRender と FallbackComponent の違い

## updated

2024/12/13

本文を大幅に修正。

## react-error-bounadry

React [ErrorBoundary](https://ja.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) は Class Component で実装する必要がある。
[react-error-bounadry](https://www.npmjs.com/package/react-error-boundary) は React の ErrorBoundary を Functional Component で実装するためのライブラリである。

## 結論

`fallbackRender` と `FallbackComponent` で出来ることに違いはない。

`fallbackRender` は意図しない動作をすることがあるので `FallbackComponent` を使っておけばいい。

## fallbackRender

react-error-boundary の `fallbackRender` を利用して、以下のように ErrorBoundary を実装できる。

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallbackRender={() => <p>Error Boundary</p>}>
  <SomeComponent />
</ErrorBoundary>;
```

上記の `<SomeComponent>` で例外を throw すると `fallbackRender` に渡された関数（`type '(props: FallbackProps) => ReactNode'`）を実行する。
以下のように直接 Functional Component に Component を渡すこともできる。

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

ただし、上記の実装には制限があるので注意が必要なようだ。

例えば、以下のように `FallbackProps` を受け取る `Fallback` コンポーネントを実装した場合、
実行時エラーが発生し正常にレンダリングされなかった。
`fallbackRender` に直接 `Fallback` を渡しても型定義エラーは発生しないので分かりにくい。

```tsx
import { FallbackProps } from "react-error-boundary";

export function Fallback({ error }: FallbackProps) {
  ...
}
```

また、以下のように Hook を実装した場合にも同様に実行時エラーが発生した。

```tsx
export function Fallback() {
  useEffect(() => {
    console.log("hi");
  });
```

`fallbackRender` を利用して `FallbackProps` と Hook を動作させる場合には以下のように実装する。

```tsx
<ErrorBoundary fallbackRender={(props) => <Fallback {...props} />}>
```

## FallbackComponent

react-error-boundary には、`fallbackRender` とは別に `FallbackComponent` という Props が存在する。

`FallbackComponent` を利用して、以下のように ErrorBoundary を実装できる。

```tsx
import { useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function Fallback({ error }: FallbackProps)) {
  useEffect(() => {
    console.log("hello");
  }, []);

  return <p>Error Boundary</p>;
}

<ErrorBoundary fallbackComponent={Fallback}>
  <SomeComponent />
</ErrorBoundary>;
```

`fallbackRender` とは異なり、`FallbackComponent` は上記の実装でも React の Hook や Context を利用できる。`FallbackProps` も上記の実装で扱うことができる。

したがって、`FallbackComponent` は `fallbackRender` より記述量が少なく済む。

追加の Props を渡すためには、以下のように実装する。この場合は `fallbackRender` と同じ。

```tsx
<ErrorBoundary FallbackComponent={(props) => <Fallback {...props} text={"hoge"} />}>
```

## 経緯

結局、`fallbackRender` と `FallbackComponent` で同じことが実現できるのに、なぜ react-error-boundary は 2 つの Props を定義したのだろうか。

[Provide extra props to fallback component](https://github.com/bvaughn/react-error-boundary/issues/26) によると、`FallbackComponent` は Props として最初から存在していたことが分かる。

詳細は分からないが、Component に独自の Props を渡す上で、より適切な命名の Props として `fallbackRender` が実装されたという経緯のように解釈できた。

## 結論 (再掲)

命名を気にしなければ常に `FallbackComponent` を使うでも問題ないと思う。
