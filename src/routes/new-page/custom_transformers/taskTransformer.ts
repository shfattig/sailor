// based on https://github.com/facebook/lexical/blob/main/packages/lexical-markdown/src/MarkdownTransformers.ts#L459-L467

import type { ElementTransformer } from "@lexical/markdown";
import { ListNode, ListItemNode } from "svelte-lexical";
import {
  $createListItemNode,
  $isListNode,
  type ListType,
  $isListItemNode,
  $createListNode,
} from "@lexical/list";
import { ElementNode } from "lexical";
import {
  $isTaskListItemNode,
  $createTaskListItemNode,
  TaskListItemNode,
} from "./taskItemNode";

const TASK_LIST_REGEX = /^(\s*)(?:\*\s)?\s?(\[(\s|x)?\])\s(.*?)(?:\s(?:#)(\w+))?$/i;
const LIST_INDENT_SIZE = 2;

export const taskTransformer: ElementTransformer = {
  dependencies: [ListNode, TaskListItemNode],
  export: (node, exportChildren) => {
    if (!$isListNode(node)) return null;

    return node
      .getChildren()
      .map((child) => {
        if ($isTaskListItemNode(child)) {
          const content = exportChildren(child);
          const taskId = child.getTaskID();
          return `* [ ] ${content}${taskId ? ` #${taskId}` : ""}`;
        }
        return null;
      })
      .join("\n");
  },
  regExp: TASK_LIST_REGEX,
  replace: (parentNode, children, match) => {
    const [, whitespace, checkboxGroup, checkState, content, taskId] = match;
    const listNode = $createListNode("check");
    const listItemNode = $createTaskListItemNode(taskId || null);

    // Add content to list item
    listItemNode.append(...children);
    listNode.append(listItemNode);
    parentNode.replace(listNode);
  },
  type: "element",
};
