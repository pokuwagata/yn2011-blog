import Link from "next/link";
import { getPosts } from "@/app/lib/post";

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
              <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
