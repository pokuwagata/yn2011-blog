import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import RehypeCodeTitles from "rehype-code-titles";
import RehypePrettyCode from "rehype-pretty-code";
import { MDXCustomComponents } from "@/components/Mdx";
import { baseURL, ogpURL, siteName } from "@/app/const";
import { getFiles, getFile } from "@/lib/file";
import rehypeImageSize from "@/lib/imgSize";

export async function generateMetadata(props: any) {
  const params = await props.params;
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
          url: ogpURL(title),
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
  ...MDXCustomComponents,
};

export default async function Page(props: any) {
  const params = await props.params;
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
              rehypeImageSize,
              [
                RehypeCodeTitles,
                {
                  titleSeparator: ":",
                },
              ],
              [
                // @ts-ignore
                RehypePrettyCode,
                {
                  theme: "tokyo-night",
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
