import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type metadata = {
  title: string;
  date: string;
  public?: boolean;
};

const directoryPath = path.join(process.cwd(), "posts");

function findFileTitle(fileName: string) {
  return fileName.match(/^(.+)\.(mdx|md)$/);
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
  const fullPath = fs
    .readdirSync(directoryPath)
    .filter((fileName) => {
      const match = findFileTitle(fileName);
      if (match && match[1] === slug) return true;
    })
    .map((fileName) => {
      return path.join(directoryPath, fileName);
    })[0];

  try {
    const { data, content } = matter(
      fs.readFileSync(fullPath, { encoding: "utf8" }),
    );

    if (!(data.title && data.date)) {
      throw new Error(`${fullPath} is wrong:` + JSON.stringify(data));
    }

    return {
      slug,
      data: {
        title: data.title,
        date: data.date.toISOString().split("T")[0],
        public: data.public,
      },
      content,
    };
  } catch (e) {
    console.error(e);
    return {
      slug,
      error: e,
    };
  }
}
