import Link from "next/link";
import { baseURL, siteName } from "@/app/const";
import "@/app/globals.css";

export const metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "yn2011 の技術ブログ",
  openGraph: {
    title: siteName,
    url: baseURL,
    images: [
      {
        url: `${baseURL}/api/og?title=${encodeURIComponent(siteName)}`,
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
    <html lang="ja">
      <body className="bg-gray-800 text-white">
        <div className="mx-auto flex min-h-screen max-w-[960px] flex-col px-4">
          {/* <div className="mb-10 flex-1"> */}
          <div className="mb-10">
            <header className="my-5">
              <h1 className="text-xl font-bold">
                <Link href="/">yn2011&apos;s blog</Link>
              </h1>
            </header>
            {children}
          </div>
          <footer className="mx-[calc(50%_-_50vw)] mt-auto bg-gray-700 px-[calc(50vw_-_50%)] pb-5 pt-10">
            <nav className="mb-5">
              <ul>
                <li className="mb-3">
                  <p className="mb-1">
                    <Link href="/" className="text-lg underline ">
                      yn2011&apos;s blog
                    </Link>
                  </p>
                  <p className="text-sm text-gray-400">
                    yn2011 の技術ブログです。
                  </p>
                </li>
                <li>
                  <Link href="/about" className="underline">
                    about
                  </Link>
                </li>
              </ul>
            </nav>
            <p className="text-center text-xs text-gray-400">© 2023 yn2011</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
