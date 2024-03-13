---
title: Next.js で SWR の Conditional Fetching をする
date: 2023-10-27
public: true
---

# Next.js で SWR の Conditional Fetching をする

## 前提

- Next.js v13.4.x
- SWR v2.2.x

## SWR の Conditional Fetching

[SWR](https://swr.vercel.app/) には [Conditional Fetching](https://swr.vercel.app/docs/conditional-fetching.en-US) という機能がある。

例えば、Conditional Fetching を利用して `API_KEY` という Cookie を持つ場合に fetch を行う hooks を実装をすると以下になる。

```tsx
import Cookies from "js-cookie";

export function useUserInfo(options?: any) {
   return useSWR<UserInfo, APIError>(
     () => {
       if (Cookies.get("API_KEY")) {
         return "/user/info";
       } else {
         return null;
       }
     },
     fetcher,
     options
   );
 }
```

Conditional Fetching を利用することで、無駄な API リクエストを減らすことができる。

## Hydration エラー

Next.js で SWR の Conditional Fetching を利用していると、以下のような Hydration エラーに遭遇することがある。

`app-index.js:32 Warning: Expected server HTML to contain a matching <p> in <div>.`

これは SSR のレンダリング結果とクライアントサイドでのレンダリング結果が異なるために発生する。

例えば、上記の Cookie の例では SSR 時は常にリクエストを行わないので `useUserInfo` はデータを取得できない。一方で、クライアントサイドでのレンダリング時に `API_KEY` という Cookie をブラウザが持っていた場合はリクエストが行われる。そのため、レスポンスを利用してコンポーネントをレンダリングしている場合は当然 SSR 時のレンダリング結果とは違ってしまう。

## 回避策

要件にもよるとは思うが、クライアントサイドに依存してレンダリング結果が決まるものは SSR しないのが 1 番良いと思う。

例えば、`useEffect` を利用して以下のように実装できる。

```tsx
function App() {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR ? (<Loading />) : (<Component />)
}
```

この場合は `<Component />` はクライアントサイドでのみレンダリングされるので、`<Component />` で Conditional Fetching をしても Hydration エラーは発生しない。

## `fallbackData` について

`useSWR` の [options](https://swr.vercel.app/docs/api#options) に `fallbackData` がある。

Conditional Fetching では、`fallbackData` が設定されていると条件を満たさなかった場合にその値が利用される。

また、SSR 時に Conditional Fetching をすると無条件で `fallbackData` が利用される。

上記の回避策のようにクライアントサイドでのレンダリング時のみに Conditional Fetching をしなくても、`fallbackData` を利用して SSR するという選択もある。ただし、クライアントサイドで条件を満たさなかったから `fallbackData` が利用されているのか、SSR 時に `fallbackData` が利用されているのかは区別できない点は注意が必要。

要件によっては、最初は `fallbackData` を表示しておきユーザイベントに応じてリクエストを行うという実装でも良いかもしれない。
