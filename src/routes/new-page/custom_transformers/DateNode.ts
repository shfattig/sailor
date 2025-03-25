import { type EditorConfig, type SerializedLexicalNode, DecoratorNode } from "lexical";

type SerializedDateNode = SerializedLexicalNode & {
  date: string | null;
};

export class DateNode extends DecoratorNode<HTMLElement> {
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

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("input");
    dom.type = "date";
    if (this.__date) {
      dom.value = this.__date;
    }
    dom.classList.add("date-node");
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

  decorate(): HTMLInputElement {
    const element = this.createDOM();
    element.addEventListener("change", (event) => {
      const newValue = (event.target as HTMLInputElement).value;
      element.dispatchEvent(new CustomEvent('date-change', { detail: newValue }));
    });
    return element;
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

export function $createDateNode(taskID: string | null): DateNode {
  return new DateNode("2024-10-04");
}
