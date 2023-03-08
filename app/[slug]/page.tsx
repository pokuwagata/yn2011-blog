import { getFiles, getFile } from "@/app/lib/file";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { baseURL, siteName } from "@/app/const";

const components = {};

export function generateMetadata({ params }: any) {
  const slug = params.slug;
  const { data } = getFile(slug);
  const title = data?.title ?? "not found";

  return {
    title,
    openGraph: {
      title,
      url: `${baseURL}${slug}/`,
      siteName,
      images: [
        {
          url: `${baseURL}api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "ja_JP",
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const posts = getFiles().map((file) => {
    return {
      slug: file?.slug,
    };
  });

  return posts;
}

export default async function Page({ params }: any) {
  const { data, content } = await getFile(params.slug);

  if (!data || !content) {
    notFound();
  }

  const date = data.date;

  return (
    <>
      <time>{date}</time>
      {/* @ts-ignore */}
      <MDXRemote source={content} components={components} />;
    </>
  );
}
