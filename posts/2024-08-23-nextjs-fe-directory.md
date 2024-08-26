---
title: フロントエンドのディレクトリ設計 (Next.js Pages Router)
date: 2024-08-23
public: true
---

# フロントエンドのディレクトリ設計 (Next.js Pages Router)

2023 ~ 2024 年にかけて業務で新規プロダクトを開発した。その際に、フロントエンドではどのようなディレクトリ構成を採用したのかを書いていく。

## 技術スタック

### npm パッケージ

```md
"next": "^14.2.3"
"react": "^18.3.1"
"react-error-boundary": "^4.0.13"
"swr": "^2.2.5"
"typescript": "5.1.3"
"orval": "^6.31.0"
```

### その他

- Next.js は Pages Router を使用
- SSG を行い静的ホスティング
  - ログイン機能があり、ユーザごとに表示の切り替えが必要な UI がある
  - (諸事情により SSG ではあるものの) ページの大部分は API レスポンスを元に CSR する
- React の Suspense, Context, ErrorBoundary を使用

## 概要

`src` 配下のディレクトリ構成（主要なディレクトリのみを掲示）

```md
./src
├── components // ⭐
├── contexts
│   └── UserContext.tsx
├── features // ⭐
│   ├── detail
│   │   ├── components
│   │   ├── hooks
│   │   ├── tests
│   │   └── contexts
│   └── about
│       └── components
├── pages
│   ├── 404.tsx
│   ├── _app.tsx
│   ├── product
│   │   └── detail
│   │       └── index.tsx
│   └── about
│       └── index.tsx
└── types // ⭐
    ├── openapi.schemas.ts
    └── window.d.ts
```

## features ディレクトリ

```md
├── features
│   ├── detail
│   │   ├── components
│   │   ├── hooks
│   │   ├── tests
│   │   └── contexts
```

Next.js の Pages 単位で `features` 配下にディレクトリを作成した。（例: `pages/product/detail/index.tsx` には `features/detail` が対応）

各 features ディレクトリ内にはそのページでしか使用しない Component, Hooks, Context を配置した。対応するテストコードも `tests` 内に配置した。

`pages` 配下には以下のような `index.tsx` のみが配置されており、対応する `features` から Component を import する。

```tsx:pages/detail/index.tsx
import { Detail } from "~/features/detail/components/Detail"; // ⭐

export default function Page() {
  return <Detail />;
}
```

Pages Router に固有のファイルになるべく実装を書かないようにすることで今後の App Router 移行が楽になる（はず）と考えた。

## types ディレクトリ

```md
└── types
    ├── openapi.schemas.ts
    └── window.d.ts
```

[OpenAPI](https://www.openapis.org/) から TypeScript の型を自動生成している。

自動生成には [Orval](https://orval.dev/) を使用した。その他のライブラリから型を自動生成して比較してみたが、Orval が 1 番使いやすい型を生成していた印象があり採用した。

Orval は型以外にも API リクエスト用のコードも自動生成可能だが、今回は fetcher を独自に実装していたこともあり使用しなかった。Orval はデフォルトで fetch に [Axios](https://axios-http.com/) を使用したコードを生成するが、今回は Axios を使用する理由がなく、その挙動を変更できなかったのもある（もしかしたら出来るのかもしれないけど）

## components ディレクトリ

`components` ディレクトリの構成（例）

```md
./src/components
├── Modal
│   ├── Modal.module.scss
│   ├── Modal.tsx
│   └── index.ts
├── PageTopButton
│   ├── PageTopButton.module.scss
│   ├── PageTopButton.tsx
│   └── index.ts
└── SWRProvider
    ├── SWRProvider.tsx
    └── index.ts
```

`components` は `src` 直下に共通 Component 用のディレクトリを作成し、`features` 配下には各ページに固有の Component 用のディレクトリを作成した。

`components` 配下は Component ごとにディレクトリを作成した。CSS Modules を利用しているため `.scss` ファイルと実装を配下に配置した。`index.ts` では export するため以下のような実装をしている。

```ts:components/Modal/index.ts
export * from "./Modal";
```

実装の方のファイル名を `index.tsx` にしなかったのは、VSCode のファイルジャンプで扱いにくいのと、タブ名が全て `index.tsx` になると視認性が悪くなるため。

ただ、VSCode のタブ名の課題については [custom label](https://code.visualstudio.com/docs/getstarted/userinterface#_customize-tab-labels) を設定して解消できる。コンポーネントごとに `index.ts` を作成するのが少し手間でもあるので、これは個人の好みの問題かもしれない。
