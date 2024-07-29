import Image from "next/image";

export const MDXCustomComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      // className="mx-[calc(50%_-_50vw)] mb-6 mt-auto bg-gray-700 px-[calc(50vw_-_50%)] py-9 text-xl font-semibold leading-relaxed"
      className="mb-6 mt-3 border-b-2 border-gray-700 pb-6 text-xl font-semibold leading-relaxed"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mb-3 mt-9 text-xl font-semibold" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mb-3 mt-6 text-lg font-semibold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-3 text-base leading-7" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-3 list-disc pl-6" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="mb-1" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-pink-300" target="_blank" {...props} />
  ),
  sup: (props: React.ComponentProps<"sup">) => (
    <sup className="-top-2 pr-1" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <table
      className="table-auto border-collapse border border-gray-500"
      {...props}
    />
  ),
  thead: (props: React.ComponentProps<"thead">) => (
    <thead className="bg-gray-700" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="border border-gray-500 px-4 py-2" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border border-gray-500 px-4 py-2" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-gray-700 text-[0.8em] text-pink-400"
      {...props}
    />
  ),

  img: (props: React.ComponentProps<"img">) => (
    <a href={props.src}>
      {/* @ts-ignore */}
      <Image className="my-6" {...props} /> {/* eslint-disable-line*/}
    </a>
  ),
};
