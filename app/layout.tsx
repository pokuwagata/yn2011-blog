import Link from "next/link";
import { baseURL, siteName } from "@/app/const";

export const metadata = {
  title: {
    default: "yn2011's blog",
    template: "%s | yn2011's blog",
  },
  description: "yn2011 の技術ブログ",
  openGraph: {
    title: siteName,
    url: baseURL,
    images: [
      {
        url: "https://nextjs.org/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
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
