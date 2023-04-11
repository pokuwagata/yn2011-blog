import Contents from "./contents.mdx";
import { baseURL, siteName } from "@/app/const";

const title = "このサイトについて";

export const metadata = {
  title,
  openGraph: {
    title: `${title} | ${siteName}`,
    url: `${baseURL}/about`,
    images: [
      {
        url: `${baseURL}/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function Page() {
  return (
    <main>
      <Contents />
    </main>
  );
}
