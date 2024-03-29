---
title: Next.js の NEXT_PUBLIC_* という環境変数は何なのか
date: 2023-09-29
public: true
---

# Next.js の `NEXT_PUBLIC_*` という環境変数は何なのか

## `NEXT_PUBLIC_` の意味

[Bundling Environment Variables for the Browser](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser) によると
`NEXT_PUBLIC_` という prefix を環境変数名に付けることでブラウザから該当の環境変数の値を参照可能になる。

ただし、環境変数の定義方法によっては `NEXT_PUBLIC_` という prefix は不要な場合がある。

## Next.js における環境変数の定義方法

Next.js では以下の方法で環境変数を定義できる。

- `.env` ファイル
- ターミナル (例：`NEXT_PUBLIC_TEST=foo next dev`)
- `next.config.js`

`next.config.js` では以下のように定義する。

```javascript
module.exports = {
  env: {
    API_URL: 'https://examle.com'
  }
};
```

`next.config.js` で環境変数を定義した場合は、デフォルトでクライアントコードに含まれる。
当然ブラウザから参照可能になるため、この場合は `NEXT_PUBLIC_` という prefix は不要になる。

公開するとセキュリティ上問題がある環境変数 (API Key 等) が意図せず含まれないように注意する必要がある。

## `NEXT_PUBLIC_` が有効なケース

`.env` ファイルやターミナルから環境変数を定義する場合はサーバーサイド（ビルド時の Node.js 環境）からしか参照できない。

この場合に `NEXT_PUBLIC` という prefix は意味を持ち、クライアントコードに対象の環境変数の値を含めることができる。

```bash
NEXT_PUBLIC_TEST=foo next dev
```

```jsx
<p>{process.env.NEXT_PUBLIC_TEST}</p>; // foo
```

`.env` ファイルで定義できる環境の種類に制限があり、[^1]業務では `next.config.js` を利用して環境変数を定義することが多いので、
`NEXT_PUBLIC_` prefix を利用することは少ない。

`next.config.js` を利用しない場合は prefix を利用しないとブラウザから参照できない点に注意したい。

[^1]: [Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order)
