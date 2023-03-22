import { getFiles, getFile } from "@/app/lib/file";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { baseURL, siteName } from "@/app/const";

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
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="text-2xl font-bold mb-3" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="text-xl font-bold mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-lg font-bold mb-3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="mb-3" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside mb-3" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="mb-1" {...props} />,
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
      <MDXRemote source={content} components={components} />
    </>
  );
}
