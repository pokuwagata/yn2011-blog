import Link from "next/link";
import { getFiles, getFile, metadata } from "@/app/lib/file";

type Post = { slug: string; data: metadata; content: string };

function getPosts() {
  return getFiles()
    .map((file) => file.slug)
    .map((slug) => {
      return getFile(slug);
    })
    .filter((post): post is Post => !!post.data && !!post.content);
}

export default function Page() {
  const posts = getPosts();

  if (posts.length === 0) {
    return (
      <main>
        <p>記事がありません</p>
      </main>
    );
  }

  return (
    <main>
      <ul>
        {posts.map((post) => {
          const { date, title } = post.data;
          return (
            <li key={post.slug}>
              <p>
                <time>{date}</time>
              </p>
              <Link href={`/${encodeURIComponent(post.slug)}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
