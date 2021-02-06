import HtmlNode from "./HtmlNode";
import HtmlNodeAttributes from "./HtmlNodeAttributes";

export type HtmlNodeOptions = {
  tag: string;
  endTag: string;
  selfClosing: boolean;
  content: string;
  attributes: HtmlNodeAttributes ;
  children: HtmlNode[];
};

export default HtmlNodeOptions