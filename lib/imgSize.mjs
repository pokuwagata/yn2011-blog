import sizeOf from "image-size";
import { visit } from "unist-util-visit";

function rehypeImageSize() {
  return (tree, _file) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img") {
        const src = node.properties.src;

        const { width, height } = sizeOf("public" + src);
        node.properties.width = width;
        node.properties.height = height;
      }
    });
  };
}

export default rehypeImageSize;
