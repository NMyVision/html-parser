import type HtmlNodeAttributes from "./HtmlNodeAttributes.ts";
import type HtmlNodeOptions from "./HtmlNodeOptions.ts";
import HtmlNodeType from "./HtmlNodeType.ts";

export default class HtmlNode {
  _outerHTML?: string;

  private startIndex: number;
  private endIndex: number;

  public readonly type: HtmlNodeType;
  public readonly children: HtmlNode[];

  public tag?: string;
  public endTag?: string;
  public selfClosing?: boolean;
  public content?: string;
  public attributes: HtmlNodeAttributes | undefined;

  public constructor(type: HtmlNodeType, options?: Partial<HtmlNodeOptions>) {
    this.type = type;
    this.tag = options?.tag;
    this.children = [];
    this.attributes = {};
    this.startIndex = 0;
    this.endIndex = 0;
    if (options) {
      this.endTag = options.endTag;
      this.selfClosing = options.selfClosing;
      this.content = options.content;
      if (options.attributes !== undefined) {
        this.attributes = options.attributes ?? {};
      }
      if (options.children !== undefined) {
        this.children = options.children ?? [];
      }
    }
  }

  public get outerHTML(): string {
    return this._outerHTML ?? "";
  }

  public setEndIndex(index: number, source: string): void {
    this.endIndex = index;
    this._outerHTML = source.substring(this.startIndex, this.endIndex);
  }

  addChildren(enumerable: HtmlNode[]): void {
    this.children.push(...enumerable);
  }

  static get empty(): HtmlNode {
    return new HtmlNode(HtmlNodeType.Element);
  }

  static CreateDocType(content: string): HtmlNode {
    return new HtmlNode(HtmlNodeType.DocType, { content });
  }

  static CreateWhiteSpace(content: string = ""): HtmlNode {
    return new HtmlNode(HtmlNodeType.Whitespace, { content });
  }

  static CreateComment(): HtmlNode {
    return new HtmlNode(HtmlNodeType.Comment);
  }

  static CreateElement(value: number | string): HtmlNode {
    const node = new HtmlNode(HtmlNodeType.Element, {
      children: [],
      attributes: {},
    });

    if (typeof value === "number") {
      node.startIndex = value;
    } else if (typeof value === "string") {
      node.tag = value;
    }

    return node;
  }

  static CreateText(content: string = ""): HtmlNode {
    return new HtmlNode(HtmlNodeType.Text, { content });
  }
}
