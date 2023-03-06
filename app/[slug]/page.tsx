import { getFiles, getFile } from "@/app/lib/file";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Image from "next/image";

const components = {
  // img: (props) => <Image {...props} width={100} height={100} />,
};

export async function generateMetadata({ params }: any) {
  const { data } = await getFile(params.slug);

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
