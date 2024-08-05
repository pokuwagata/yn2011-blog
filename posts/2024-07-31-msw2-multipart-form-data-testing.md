---
title: MSW 2 を利用して React Component が送信する multipart/form-data 形式の Request Body をテストする
date: 2024-07-31
public: true
---

# Jest と MSW 2 を利用して React Component が送信する multipart/form-data 形式の Request Body をテストする

## サンプルコード

[msw2-jest-sandbox](https://github.com/pokuwagata/msw2-jest-sandbox)

## 前提

```md
"typescript": "^5",
"next": "14.0.4",
"react": "^18",
"msw": "^2.0.11",
"jest": "^29.7.0",
"jest-environment-jsdom": "^29.7.0",
"@testing-library/jest-dom": "^6.1.5",
"@testing-library/react": "^14.1.2",
"undici": "^5.0.0"
```

## 背景

MSW 1 では モックした API に送信された `multipart/form-data` 形式の Request Body をパースできなかった。`multipart/form-data` 形式でリクエストを送信するフォームを実装している場合に、リクエスト内容を検証するテストコードを MSW を使って実装できないという課題があった。

## MSW 2 を Jest 向けに設定する

Jest から MSW 2 のサーバーを動作させるといくつかのエラーが発生した。[Frequent issues](https://mswjs.io/docs/migrations/1.x-to-2.x/#frequent-issues) に記載の方法で解消できた。

また、MSW 2 を Jest で動作させるためには undici のインストールが必要だが、undici v6 は動作しないため v5 を利用する必要がある。

[Always results in Network Error when using undici 6.x #2172](https://github.com/mswjs/msw/issues/2172#issuecomment-2225185717)

## Request Body をテストする

例として、ユーザが名前と年齢を入力して送信できるフォームのテストコードを実装する。

まず、Next.js (App Router) の Client Component で以下のようにフォームを実装した。ちなみに App Router なので [Server Action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms) でも実装できるが、この記事の趣旨から外れるのでクライアントサイドから API をリクエストしている。

また、サンプル実装なのでバリデーションや異常系等は考慮していない。

```tsx:page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  async function handleSubmit() {
    const body = new FormData();
    body.append("name", name);
    body.append("age", age.toString());

    await fetch("http://localhost:3000/api/test", {
      method: "POST",
      body,
    });
  }

  return (
    <main>
      <form>
        <div>
          <label>
            name
            <input
              name="name"
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            age
            <input
              name="age"
              type="number"
              onChange={(e) => {
                setAge(Number(e.target.value));
              }}
            />
          </label>
        </div>
      </form>
      <button onClick={handleSubmit}>submit</button>
    </main>
  );
}
```

次に以下のようにテストコードを実装した。重要な箇所には ⭐ 付きのコメントを付与した。

```tsx:page.test.tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";
import Home from "@/app/page";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("test", async () => {
  const mockfn = jest.fn();

  server.use( // ⭐ 一時的に API をモックする
    http.post("http://localhost:3000/api/test", async ({ request }) => {
      const formData = await request.formData(); // ⭐ multipart/form-data 形式の Request Body をパース

      mockfn({
        name: formData.get("name"),
        age: formData.get("age"),
      }); // ⭐ Request Body から値を取得してモック関数を呼び出す

      return HttpResponse.json(
        {
          result: "ok",
        },
        { status: 200 }
      );
    })
  );

  const inputData = {
    name: "foo",
    age: "30",
  };

  render(<Home />);

  await userEvent.type(screen.getByLabelText("name"), inputData.name); // ⭐ フォームに値を入力
  await userEvent.type(screen.getByLabelText("age"), inputData.age);

  await userEvent.click(screen.getByText("submit"));

  expect(mockfn).toHaveBeenCalledWith(inputData); // ⭐ フォームに入力した値と API に送信された値が同一であることをモック関数を利用して確認
});

```

このように、`multipart/form-data` 形式の Request Body をテストできる。

## Jest のプロセスが終了しない問題

実はサンプルコードの実装では、`npm run test` で Jest を実行するとテストはパスするが、以下の文言が表示されプロセスが終了しない。

```bash
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

調査はしてみたが、原因は不明だった。おそらく MSW 2 に起因しているのではないかと推測している。

仕方がないので、`--forceExit` オプションを付与して強制的に終了させている。
