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
        <span className="rounded-t bg-slate-600 px-3 py-1 text-xs">
          {fileName}
        </span>
      )}
      <SyntaxHighlighter
        language={lang}
        style={ocean}
        customStyle={{
          paddingTop: "1rem",
          paddingBottom: "1rem",
          fontSize: "0.875rem",
          borderTopRightRadius: "0.25rem",
          borderBottomRightRadius: "0.25rem",
          borderBottomLeftRadius: "0.25rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </>
  );
}
