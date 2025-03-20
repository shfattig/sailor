// based on https://github.com/facebook/lexical/blob/main/packages/lexical-markdown/src/MarkdownTransformers.ts#L459-L467

import type { ElementTransformer } from "@lexical/markdown";
import { ListNode, ListItemNode } from "svelte-lexical";
import {
  $createListItemNode,
  type ListType,
  $isListNode,
  $isListItemNode,
  $createListNode,
} from "@lexical/list";
import { ElementNode } from "lexical";

const CHECK_LIST_REGEX = /^(\s*)(?:\*\s)?\s?(\[(\s|x)?\])\s/i;
const LIST_INDENT_SIZE = 2;

const listReplace = (listType: ListType): ElementTransformer["replace"] => {
  return (parentNode, children, match) => {
    const previousNode = parentNode.getPreviousSibling();
    const nextNode = parentNode.getNextSibling();
    const listItem = $createListItemNode(
      listType === "check" ? match[3] === "x" : undefined,
    );
    if ($isListNode(nextNode) && nextNode.getListType() === listType) {
      const firstChild = nextNode.getFirstChild();
      if (firstChild !== null) {
        firstChild.insertBefore(listItem);
      } else {
        // should never happen, but let's handle gracefully, just in case.
        nextNode.append(listItem);
      }
      parentNode.remove();
    } else if (
      $isListNode(previousNode) &&
      previousNode.getListType() === listType
    ) {
      previousNode.append(listItem);
      parentNode.remove();
    } else {
      const list = $createListNode(
        listType,
        listType === "number" ? Number(match[2]) : undefined,
      );
      list.append(listItem);
      parentNode.replace(list);
    }
    listItem.append(...children);
    listItem.select(0, 0);
    const indent = getIndent(match[1]);
    if (indent) {
      listItem.setIndent(indent);
    }
  };
};

export const checkboxTransformer: ElementTransformer = {
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null;
  },
  regExp: CHECK_LIST_REGEX,
  replace: listReplace("check"),
  type: "element",
};

const listExport = (
  listNode: ListNode,
  exportChildren: (node: ElementNode) => string,
  depth: number,
): string => {
  const output = [];
  const children = listNode.getChildren();
  let index = 0;
  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild();
        if ($isListNode(firstChild)) {
          output.push(listExport(firstChild, exportChildren, depth + 1));
          continue;
        }
      }
      const indent = " ".repeat(depth * LIST_INDENT_SIZE);
      const listType = listNode.getListType();
      const prefix =
        listType === "number"
          ? `${listNode.getStart() + index}. `
          : listType === "check"
            ? `* [${listItemNode.getChecked() ? "x" : " "}] `
            : "* ";
      output.push(indent + prefix + exportChildren(listItemNode));
      index++;
    }
  }

  return output.join("\n");
};

function getIndent(whitespaces: string): number {
  const tabs = whitespaces.match(/\t/g);
  const spaces = whitespaces.match(/ /g);

  let indent = 0;

  if (tabs) {
    indent += tabs.length;
  }

  if (spaces) {
    indent += Math.floor(spaces.length / LIST_INDENT_SIZE);
  }

  return indent;
}
