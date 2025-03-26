import { ListItemNode, type SerializedListItemNode } from "@lexical/list";
import TaskListItem from "./TaskListItem.svelte";
import {
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
} from "lexical";
import { invoke } from "@tauri-apps/api/core";

type SerializedTaskListItemNode = SerializedListItemNode & {
  taskID: string | null;
};

export class TaskListItemNode extends ListItemNode {
  __taskID: string | null;

  static getType(): string {
    return "task-list-item";
  }

  static clone(node: TaskListItemNode): TaskListItemNode {
    return new TaskListItemNode(
      node.__taskID,
      node.__value,
      node.__checked,
      node.__key,
    );
  }

  constructor(
    taskID: string | null = null,
    value?: number,
    checked?: boolean,
    key?: NodeKey,
  ) {
    super(value, checked, key);
    this.__taskID = taskID;
  }

  setTaskID(taskID: string | null): void {
    const self = this.getWritable();
    self.__taskID = taskID;
  }

  getTaskID(): string | null {
    return this.__taskID;
  }

  exportJSON(): SerializedTaskListItemNode {
    return {
      ...super.exportJSON(),
      taskID: this.__taskID,
      type: "task-list-item",
      version: 1,
    };
  }

  static importJSON(
    serializedNode: SerializedTaskListItemNode
  ): TaskListItemNode {
    return $createTaskListItemNode(serializedNode.taskID);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const listItemDOM = super.createDOM(config);
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

  async setDueDate(date: string) {
    const taskId = this.getTaskID();
    try {
      await invoke("update_task", { taskId, date });
    } catch (error) {
      console.error("Failed to update task date", error);
    }
  }
}

export function $createTaskListItemNode(
  taskID: string | null,
): TaskListItemNode {
  return new TaskListItemNode(taskID);
}

export function $isTaskListItemNode(
  node: LexicalNode | null | undefined,
): node is TaskListItemNode {
  return node instanceof TaskListItemNode;
}
