import { type EditorConfig, type SerializedLexicalNode, DecoratorNode } from "lexical";
import DateNodeComponent from "./DateNode.svelte";

type SerializedDateNode = SerializedLexicalNode & {
  date: string | null;
};

export class DateNode extends DecoratorNode {
  __date: string | null;

  static getType(): string {
    return "date";
  }

  static clone(node: DateNode): DateNode {
    console.log("Cloning date node");
    const newdatenode = new DateNode(node.__date);
    newdatenode.__key = node.__key;
    console.log("newdatenode", newdatenode);
    return newdatenode;
  }

  constructor(date: string | null = null, key?: string) {
    super(key);
    this.__date = date;
  }

  getDate(): string | null {
    return this.__date;
  }

  setDate(date: string | null): void {
    this.__date = date;
  }

  createDOM(config: EditorConfig): HTMLInputElement {
    const dom = document.createElement("div");
    dom.id =  `{this.__key}-container`
    return dom;
  }

  updateDOM(prevNode: DateNode, dom: HTMLInputElement): boolean {
    const prevDate = prevNode.__date;
    const nextDate = this.__date;
    if (prevDate !== nextDate) {
      dom.value = nextDate || "";
      return true;
    }
    return false;
  }

  decorate() {
    return {
      componentClass: DateNodeComponent,
      updateProps: (props) => {props.node = this},
    };
  }

  static importJSON(serializedNode: SerializedDateNode): DateNode {
    return new DateNode(serializedNode.date);
  }

  exportJSON(): SerializedDateNode {
    return {
      ...super.exportJSON(),
      date: this.__date,
      type: "date",
      version: 1,
    };
  }

  static importDOM(): null {
    return null;
  }

  exportDOM(): { element: HTMLElement } {
    const element = document.createElement("input");
    element.type = "date";
    element.value = this.__date || "";
    element.addEventListener("change", (event) => {
      this.setDate((event.target as HTMLInputElement).value);
    });
    return { element };
  }
}

export function $createDateNode(dueDate: string | null): DateNode {
  return new DateNode(dueDate);
}
