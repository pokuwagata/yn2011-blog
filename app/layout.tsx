import Link from "next/link";
import { baseURL, siteName } from "@/app/const";
import "@/app/globals.css";

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
      <body className="bg-gray-800 text-white">
        <div className="mx-auto max-w-[960px] px-4">
          <header className="my-5">
            <h1 className="text-xl font-bold">
              <Link href="/">yn2011&apos;s blog</Link>
            </h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
