export const MDXCustomComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mb-9 text-2xl font-semibold" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mb-3 mt-6 text-lg font-semibold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="mb-3" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-3 list-inside list-disc" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="mb-1 ml-2" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-pink-300 underline" {...props} />
  ),
};
