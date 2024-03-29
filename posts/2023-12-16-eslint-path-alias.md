---
title: ESLint で path alias を使っていない import 文を検出する
date: 2023-12-16
public: true
---

# ESLint で path alias を使っていない import 文を検出する

## path alias とは

TypeScript では import 文で alias を使うことができる。

例えば、`tsconfig.json` の [paths](https://www.typescriptlang.org/tsconfig#paths) で `@` を alias として、以下のように from 句を記述するように設定できる。

```typescript
// before
import Foo from '../components/Foo';

// after
import Foo from '@/Foo';
```

ただし、これまで通り相対パスを使った import 文を書くこともできるため path alias を使った import 文と混在してしまうという課題がある。

## eslint-import-alias

[steelsojka/eslint-import-alias](https://github.com/steelsojka/eslint-import-alias) を使うと、path alias を使っていない import 文の検出が可能になる。

例えば以下のように `eslintrc.json` にルールを追加する。

```json:eslintrc.json
{
  ...
  "plugins": ["eslint-plugin-import-alias"],
  "rules": {
    ...
    "import-alias/import-alias": [
      "error",
      {
        "relativeDepth": 0
      }
    ]
  }
}
```

すると、相対パスを利用している import 文に対して ESLint がエラーを出す。

```typescript
// error
import Foo from '../components/Foo';

// OK
import Foo from '@/Foo';
```

`relativeDepth` を `0` に設定すると同一階層への相対パスは許容になる。

```typescript
// error
import Foo from '../components/Foo';

// OK
import Foo from './Foo';
```

`relativeDepth` が未指定の場合は同一階層もエラーを出す。

```typescript
// error
import Foo from './Foo';
```

## VSCode の `importModuleSpecifier`

ちなみに、相対パスを使った import 文が生成される原因の 1 つに VSCode の Quick Fix がある。

{/* <!-- textlint-disable sentence-length --> */}

VSCode はデフォルトだと相対パスで import 文を生成する。`settings.json` の `typescript.preferences.importModuleSpecifier` の値を `non-relative` に設定すると、プロジェクトの `tsconfig.json` の `paths` と `baseUrl` を元にして自動的にパスを生成できる。

{/* <!-- textlint-enable sentence-length --> */}

こうしておくだけでも、相対パスを使った import 文の混入を未然に防ぐことができる。

## まとめ

たかが import 文だが、こういった細かい部分を統一していくことは、コードベース全体をクリーンな状態に保っていくための基本だと思う。

割れ窓をできるだけ少なくしていくことで、新たに書かれるコードの品質低下を防ぐことができる。コードベースの内部品質を高めて開発生産性の向上へと繋げていきましょう。
