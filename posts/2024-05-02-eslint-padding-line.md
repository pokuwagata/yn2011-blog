---
title: ESLint で空行に関するルールを設定する
date: 2024-05-02
public: true
---

# ESLint で空行に関するルールを設定する

## モチベーション

コードの文と文の間に適切な空行が挿入されているとコードの可読性が高まる。

例えば、空行をまったく挿入せずにコードを書くと以下のようになるだろう。

```js
function foo() {
  setup();
  const params = {
    a: 1;
  };
  bar1(params);
  if (hoge) {
    bar2();
    return
  }
  return
}
```

以下のように空行を挿入したコードの方が読みやすいと感じる人は多いだろう。

```js
function foo() {
  setup();

  const params = {
    a: 1;
  };

  bar1(params);

  if (hoge) {
    bar2();

    return
  }

  return
}
```

しかし、どこに空行を挿入するかは実装者の感覚に依存しているため、以下の課題がある。

- コードレビューやモブプログラミングで「ここは空行があってもいいんじゃないか」と感じても指摘しにくい
- チーム開発をしている場合はコードベース全体で統一するのが難しい

## ESLint

ESLint に空行に関するルールがないか調べてみたところ見つかった。

@stylistic/js に [padding-line-between-statements](https://eslint.style/rules/js/padding-line-between-statements) というルールがある。

例えば、`return` 文の前には必ず空行を挿入したい場合は以下のように設定する。

```json
{ "blankLine": "always", "prev": "*", "next": ["return"] }
```

これで、`eslint --fix` すると自動的に `return` 文の前には空行を挿入してくれる。

## 設定例

業務で関わっているコードベースには以下の設定を適用している。

```json
"plugins": ["@typescript-eslint", "@stylistic"],
   "rules": {
     "@stylistic/padding-line-between-statements": [
       "error",
         { "blankLine": "always", "prev": "*", "next": ["return", "multiline-expression", "block-like", "try", "throw"] },
         { "blankLine": "always", "prev": ["multiline-expression", "block-like", "const", "let"], "next": "*" },
         { "blankLine": "any", "prev": ["const", "let"], "next": ["const", "let"] }
     ]
   }
```

ざっくりと説明すると以下のようなルールになっている。

- `return`, `if`, `try`, 複数行の式文等は前方に空行
- `if`, 変数宣言, 複数行の式文等は後方に空行
- 変数宣言文同士の間には空行は不要

ちなみに、 `multiline-expression` が複数行の式文を指す。主に関数の実行 `foo();` 等が該当する。`block-like` が主に `if`, `while` を指す。

最後のルールの `{ "blankLine": "any", "prev": ["const", "let"], "next": ["const", "let"] }` で変数宣言文同士の間には空行を強制しないように設定している。変数宣言は固まりとして書きたいことが多いと思ったためそうしている。

例えば、以下のコードでは `a`, `b` の間は空行が入らないが、1 番目のルールによって式文の前には空行が入る。また、2 番目のルールによって `b` の次には空行が入る（結果的に 1 つの空行になる）

```js
const a = 1;
const b = 2;

foo();
```
