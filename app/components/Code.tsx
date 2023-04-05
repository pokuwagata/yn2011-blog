"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export function Code({ lang, code }: { lang: string; code: string }) {
  return (
    <SyntaxHighlighter language={lang} style={ocean}>
      {code}
    </SyntaxHighlighter>
  );
}
