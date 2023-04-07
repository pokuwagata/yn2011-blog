import Link from "next/link";
import { getPosts } from "@/lib/post";

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
            <li className="mb-3" key={post.slug}>
              <p className="mb-1">
                <time className="text-gray-400">{date}</time>
              </p>
              <Link
                className="text-lg text-pink-300 visited:text-pink-700 underline"
                href={`/posts/${encodeURIComponent(post.slug)}`}
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
