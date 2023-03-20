import { Feed } from "feed";
import { siteName } from "@/app/const";
import { baseURL } from "@/app/const";
import { getPosts } from "@/app/lib/post";

export const generateFeed = async () => {
  const feed = new Feed({
    title: siteName,
    description: "",
    id: baseURL,
    link: baseURL,
    language: "ja",
    copyright: `© 2023 yn2011`,
    updated: new Date(),
    author: {
      name: "yn2011",
    },
    feed: `${baseURL}/feed`,
  });

  const posts = getPosts();

  posts.forEach((post) => {
    const url = `${baseURL}/${post.slug}`;
    feed.addItem({
      title: post.data.title,
      content: post.content,
      id: url,
      link: url,
      date: new Date(post.data.date),
    });
  });

  return feed.rss2();
};
