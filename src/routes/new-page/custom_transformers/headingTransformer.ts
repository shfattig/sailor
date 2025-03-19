import {
  $isHeadingNode,
  $createHeadingNode,
  type HeadingTagType,
  HeadingNode,
} from "@lexical/rich-text";
import type { ElementTransformer } from "@lexical/markdown";
import {
  $getRoot as getRoot,
  $createTextNode,
  type MutationListener,
  ElementNode,
  TextNode,
  type LexicalNode,
  type EditorState,
  type NodeKey,
  type NodeMutation,
  type LexicalEditor,
  type RangeSelection,
} from "lexical";

export const heading_mut_listener: MutationListener = (
  nodes: Map<NodeKey, NodeMutation>,
  payload: {
    updateTags: Set<string>;
    dirtyLeaves: Set<string>;
    prevEditorState: EditorState;
  },
) => {
  console.log("mutation!!");
  console.log(nodes);
  console.log(payload);
};

const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode,
): ElementTransformer["replace"] => {
  return (parentNode, children, match) => {
    const node = createNode(match);
    const hashNode = $createTextNode("#".repeat(match[1].length) + " ");
    hashNode.setStyle("color: #999");
    node.append(hashNode);
    node.append(...children);
    parentNode.replace(node);
    node.select(1, 1);
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
