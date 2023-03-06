import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type metadata = {
  title: string;
  date: string;
};

const directoryPath = path.join(process.cwd(), "articles");

function findFileTitle(fileName: string) {
  return fileName.match(/^(.+)\.mdx$/);
}

export function getFiles() {
  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => {
      if (findFileTitle(fileName)) return true;
    })
    .map((fileName) => {
      const found = findFileTitle(fileName);
      const filePath = path.join(directoryPath, fileName);

      return {
        slug: found![1],
        path: filePath,
      };
    })
    .sort((a, b) => {
      if (a.slug < b.slug) return 1;
      else if (a.slug > b.slug) return -1;
      else return 0;
    });
}

export function getFile(slug: string): {
  slug: string;
  data?: metadata;
  content?: string;
  error?: unknown;
} {
  const filePath = path.join(directoryPath, slug + ".mdx");

  try {
    const { data, content } = matter(
      fs.readFileSync(filePath, { encoding: "utf8" })
    );
    return {
      slug,
      data: { title: data.title, date: data.date.toISOString().split("T")[0] },
      content,
    };
  } catch (e) {
    return {
      slug,
      error: e,
    };
  }
}
