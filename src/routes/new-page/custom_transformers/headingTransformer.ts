import {
  $isHeadingNode,
  $createHeadingNode,
  type HeadingTagType,
  HeadingNode,
} from "@lexical/rich-text";
import type { ElementTransformer } from "@lexical/markdown";
import {
  // $createTabNode,
  // $createTextNode,
  ElementNode,
  TextNode,
  type LexicalNode,
} from "lexical";

const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode,
): ElementTransformer["replace"] => {
  return (parentNode, children, match) => {
    const node = createNode(match);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  };
};

export const headingTransformer: ElementTransformer = {
  dependencies: [HeadingNode],
  export: (node, exportChildren) => {
    if (!$isHeadingNode(node)) {
      return null;
    }
    const level = Number(node.getTag().slice(1));
    return "#".repeat(level) + " " + exportChildren(node);
  },
  regExp: /^(#{1,6})\s/,
  replace: createBlockNode((match) => {
    const tag = ("h" + match[1].length) as HeadingTagType;
    return $createHeadingNode(tag);
    // replace: (parentNode: ElementNode, textNode: TextNode, match: RegExpExecArray) => {
    // const matchResult = match.exec(textNode.getTextContent());
    // if (match) {
    //   const hashes = match[1];
    //   const content = match[2];
    //   const tag = `h${level}` as HeadingTagType;

    //   const headingNode = $createHeadingNode(tag);
    //   const hashNode = $createTextNode(hashes);
    //   hashNode.setStyle("color: #999");

    //   headingNode.append(hashNode);
    //   headingNode.append($createTextNode(content));
    //   parentNode.append(headingNode);
    //   return true;
    // }
    // return false;
  }),
  type: "element",
};
