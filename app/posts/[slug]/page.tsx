import { getFiles, getFile } from "@/lib/file";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { baseURL, siteName } from "@/app/const";
import Image from "next/image";
import { Code } from "@/components/Code";
import { MDXCustomComponents } from "@/components/Mdx";
import remarkGfm from "remark-gfm";
import RehypeCodeTitles from "rehype-code-titles";
import RehypePrettyCode from "rehype-pretty-code";

export function generateMetadata({ params }: any) {
  const slug = params.slug;
  const { data } = getFile(slug);
  const title = data?.title ?? "not found";

  return {
    title,
    openGraph: {
      title,
      url: `${baseURL}/posts/${slug}/`,
      siteName,
      images: [
        {
          url: `${baseURL}/api/og?title=${encodeURIComponent(title)}`,
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

const components = {
  Image,
  Code,
  ...MDXCustomComponents,
};

export default function Page({ params }: any) {
  const { data, content } = getFile(params.slug);

  if (!data || !content) {
    notFound();
  }

  const date = data.date;

  return (
    <>
      <p className="mb-3">
        <time className="text-gray-400 ">{date}</time>
      </p>
      {/* @ts-ignore */}
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                RehypeCodeTitles,
                {
                  titleSeparator: ":",
                },
              ],
              [
                RehypePrettyCode,
                {
                  theme: "nord",
                  keepBackground: true,
                },
              ],
            ],
          },
        }}
      />
    </>
  );
}
