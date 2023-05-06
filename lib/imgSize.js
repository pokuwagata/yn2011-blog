import sizeOf from "image-size";
import { visit } from "unist-util-visit";

function rehypeImageSize() {
  return (tree, _file) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        const src = node.properties.src;
        const maxWidth = 960;

        let { width, height } = sizeOf("public" + src);
        if (width >= maxWidth) {
          const ratio = width / height;
          width = maxWidth;
          height = width / ratio;
        }
        node.properties.width = width;
        node.properties.height = height;
        node.properties.sizes = `(max-width: ${maxWidth}px) 100vw, ${maxWidth}w`;
      }
    });
  };
}

export default rehypeImageSize;
