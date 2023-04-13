"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export function Code({
  lang,
  code,
  fileName,
}: {
  lang: string;
  code: string;
  fileName?: string;
}) {
  return (
    <>
      {fileName && (
        <span className="rounded-t bg-slate-600 px-3 py-1">{fileName}</span>
      )}
      <SyntaxHighlighter language={lang} style={ocean}>
        {code}
      </SyntaxHighlighter>
    </>
  );
}
