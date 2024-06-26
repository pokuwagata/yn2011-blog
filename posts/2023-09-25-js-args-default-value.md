---
title: JavaScript の関数がオブジェクト型の引数を取る場合に初期値を設定する
date: 2023-09-25
public: true
---

# JavaScript の関数がオブジェクト型の引数を取る場合に初期値を設定する

JavaScript の関数は引数が与えられなかった場合に使用する初期値 (Default parameters) を定義できる。

```javascript
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5)); // 5
```

引数がオブジェクトの場合は [Destructuring 構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) を利用してプロパティごとに初期値を定義できる。

```javascript
function a({ foo = true, bar } = {}) {
  return foo;
}

console.log(a()); // true
console.log(a({ bar: 1 })); // true
```

## 参考

[Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
