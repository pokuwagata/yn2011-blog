import { getFiles, getFile } from "@/app/lib/file";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

export function generateMetadata({ params }: any) {
  const { data } = getFile(params.slug);

  return {
    title: data?.title ?? "not found",
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

export default function Page({ params }: any) {
  const { data, content } = getFile(params.slug);

  if (!data) {
    notFound();
  }

  const date = data.date;

  return (
    <>
      <time>{date}</time>
      {/* @ts-ignore */}
      <MDXRemote source={content} />;
    </>
  );
}
