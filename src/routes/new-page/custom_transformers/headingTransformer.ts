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

export const heading_transform_listener = (textNode: TextNode) => {
  // keep heading tag in sync with number of hashes in header
  const parent = textNode.getParent();
  const text = textNode.getTextContent();
  console.log("heading text:", text);

  // count the number of hashes at the beginning of the text
  let hashCount = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "#") {
      hashCount++;
    } else {
      break;
    }
  }
  console.log("hashes:", hashCount);

  // only run if the parent is a heading node and the hash count is between 1 and 6 and the tag is not already set
  const newTag = `h${hashCount}` as HeadingTagType;
  if (
    $isHeadingNode(parent) &&
    hashCount > 0 &&
    hashCount <= 6 &&
    parent.getTag() !== newTag
  ) {
    console.log(parent.getTag(), "setting tag to:", newTag);

    // create a new heading node with the correct tag
    const node = $createHeadingNode(newTag);
    // append all the children of the parent node to the new node
    node.append(...parent.getChildren());
    // replace the parent node with the new node
    parent.replace(node);
    // Set selection to the new node
    node.select(1, 1);
  }
};

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
  }),
  type: "element",
};
