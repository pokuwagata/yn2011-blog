import Link from "next/link";

export const metadata = {
  title: {
    default: "yn2011's blog",
    template: "%s | yn2011's blog",
  },
  description: "yn2011 の技術ブログ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>
            <Link href="/">yn2011&apos;s blog</Link>
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
