/** @type {import('next').NextConfig} */
import addMdx from "@next/mdx";
import imgSize from "./app/lib/imgSize.mjs";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
  experimental: {
    appDir: true,
    mdxRs: true,
  },
};

addMdx(nextConfig, {
  options: {
    remarkPlugins: [],
    rehypePlugins: [imgSize],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

export default nextConfig;
