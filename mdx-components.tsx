import type { MDXComponents } from "mdx/types";
import { MDXCustomComponents } from "@/components/Mdx";

export function useMDXComponents(components: MDXComponents) {
  return { ...components, ...MDXCustomComponents };
}
