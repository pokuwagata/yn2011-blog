import Link from "next/link";

export default function Page({ params }: any) {
  return (
    <main>
      <h1>このブログについて</h1>
      <p>yn2011 が技術的な内容について発信するブログです。</p>
      <p>RSS を配信しています。</p>
      <h2>このブログを書いている人について</h2>
      <ul>
        <li>
          Twitter: <Link href="https://twitter.com/yn2011">@yn2011</Link>
        </li>
      </ul>
    </main>
  );
}
