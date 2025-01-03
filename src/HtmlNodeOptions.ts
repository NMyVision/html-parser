import type HtmlNode from "./HtmlNode.ts";
import type HtmlNodeAttributes from "./HtmlNodeAttributes.ts";

export type HtmlNodeOptions = {
  tag: string;
  endTag: string;
  selfClosing: boolean;
  content: string;
  attributes: HtmlNodeAttributes;
  children: HtmlNode[];
};

export default HtmlNodeOptions;
