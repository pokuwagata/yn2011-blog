/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
