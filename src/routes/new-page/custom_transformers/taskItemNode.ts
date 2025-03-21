import { ListItemNode } from "@lexical/list";
import TaskListItem from "./TaskListItem.svelte";
import {
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
} from "lexical";

export class TaskListItemNode extends ListItemNode {
  __dueDate: string | null;

  static getType(): string {
    return "task-list-item";
  }

  static clone(node: TaskListItemNode): TaskListItemNode {
    return new TaskListItemNode(
      node.__dueDate,
      node.__value,
      node.__checked,
      node.__key,
    );
  }

  constructor(
    dueDate: string | null = null,
    value?: number,
    checked?: boolean,
    key?: NodeKey,
  ) {
    super(value, checked, key);
    this.__dueDate = dueDate;
  }

  setDueDate(date: string | null): void {
    const self = this.getWritable();
    self.__dueDate = date;
  }

  getDueDate(): string | null {
    return this.__dueDate;
  }

  exportJSON(): SerializedElementNode & { dueDate: string | null } {
    return {
      ...super.exportJSON(),
      dueDate: this.__dueDate,
      type: "task-list-item",
      version: 1,
    };
  }

  static importJSON(
    serializedNode: SerializedElementNode & { dueDate: string | null },
  ): TaskListItemNode {
    return $createTaskListItemNode(serializedNode.dueDate);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const listItemDOM = super.createDOM(config);
    const date_input = document.createElement("input");
    date_input.type = "date";
    date_input.value = this.__dueDate || "";
    date_input.addEventListener("change", (event) => {
      this.setDueDate((event.target as HTMLInputElement).value);
    });
    listItemDOM.append(date_input);
    listItemDOM.setAttribute("data-type", "task-list-item");
    return listItemDOM;
  }

  // updateDOM(): boolean {
  //   return false; // Returning false tells Lexical this node doesn't need DOM updates
  // }

  decorate() {
    return {
      component: TaskListItem,
      props: {
        node: this,
      },
    };
  }
}

export function $createTaskListItemNode(
  dueDate: string | null,
): TaskListItemNode {
  return new TaskListItemNode(dueDate);
}

export function $isTaskListItemNode(
  node: LexicalNode | null | undefined,
): node is TaskListItemNode {
  return node instanceof TaskListItemNode;
}
