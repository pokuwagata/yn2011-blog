import { getFiles, getFile, metadata } from "@/lib/file";

type Post = { slug: string; data: metadata; content: string };

export function getPosts() {
  return getFiles()
    .map((file) => {
      return getFile(file.slug);
    })
    .filter(
      (post): post is Post =>
        !!post.data && !!post.content && !!post.data.public,
    );
}
