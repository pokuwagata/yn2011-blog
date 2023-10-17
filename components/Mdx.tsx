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
  li: (props: React.ComponentProps<"li">) => <li className="mb-1" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-pink-300" {...props} />
  ),
  // @ts-ignore
  // eslint-disable-next-line
  img: (props: React.ComponentProps<"img">) => <Image {...props} />,
};
