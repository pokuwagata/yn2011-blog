export const MDXCustomComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="text-2xl font-semibold mb-9" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-lg font-semibold mt-6 mb-3" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="mb-3" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside mb-3" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="mb-1 ml-2" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-pink-300 underline" {...props} />
  ),
};
