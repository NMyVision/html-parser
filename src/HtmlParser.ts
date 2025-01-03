import type HtmlNodeAttributes from "./HtmlNodeAttributes.ts";
import HtmlNode from "./HtmlNode.ts";
import { defaultParserOptions, type ParserOptions } from "./ParserOptions.ts";
import StringQueue from "./StringQueue.ts";

class KeyValuePair<K, T> {
  constructor(public key: K, public value?: T) {
  }
}
  /**
   * @module
   *
   * This module contains functions to search the database.
   *
   * @example
   * ```ts
   * import { HtmlParser } from "@nmyvision/HtmlParser";
   *
   * const hp = new HtmlParser();
   * const result = hp.parse(`<article id="editor"/>`);
   * ```
   */
export class HtmlParser {
  q: StringQueue;
  source: string;

  get index(): number {
    return this.q.index;
  }

  /** */
  constructor(public options: ParserOptions = defaultParserOptions) {
    this.source = "";
    this.q = new StringQueue();
  }

  /**
   * This function parses the html string and returns a list of nodes.
   *
   * @param source the html string to be parsed
   * @returns HTMLNode[]
   */
  public parse(source: string): HtmlNode[] {
    this.source = source;
    this.q = new StringQueue(source);

    return this.internalParse();
  }

  private internalParse(parent?: HtmlNode): HtmlNode[] {
    const { q } = this;
    const list: HtmlNode[] = [];
    let node: HtmlNode = HtmlNode.empty;

    while (q.any()) {
      if (q.peek(2) == "</") {
        q.dequeue(2);
        if (parent != null) {
          parent.endTag = q.run(">");
        } else if (node != null) {
          node.endTag = q.run(">");
        } else {
          q.run(">");
        }
        q.dequeue();
        return list;
      } else if (q.peek(4) == "<!--") {
        const comment = this.getComment();
        node = HtmlNode.CreateComment();
        node.content = comment;
        list.push(node);
      } else if (q.peek(2) == "<!") {
        this.q.dequeue(2);
        const content = this.q.run(">");
        this.q.dequeue();

        node = HtmlNode.CreateDocType(content);
        list.push(node);
      } else if (q.peek() == "<") {
        node = HtmlNode.CreateElement(this.index);

        q.dequeue();
        node.tag = this.getTagName();

        if (q.peek() === " " || q.peek() === "\r" || q.peek() === "\n") {
          node.attributes = this.getAttributes();
        }

        q.skipSpace();

        if (q.isEmpty()) {
          node.setEndIndex(this.index, this.source);
          list.push(node);
          break;
        }

        // instantly closed
        if (q.peek() == ">" && (q.peek(3) == "></")) {
          q.dequeue(3);
          node.endTag = q.run(">");
          q.dequeue();

          node.setEndIndex(this.index, this.source);
          list.push(node);
        } // self closing element
        else if (q.peek(2) == "/>") {
          node.endTag = q.run("/>");
          q.dequeue(2);
          node.selfClosing = true;

          node.setEndIndex(this.index, this.source);
          list.push(node);
        } // self closing tags that don't have '/>' ie: <br>
        else if (
          q.peek() == ">" && this.options.selfClosingTags.includes(node.tag)
        ) {
          q.dequeue();
          node.selfClosing = true;
          node.setEndIndex(this.index, this.source);
          list.push(node);
        } else if (/script/i.test(node.tag)) {
          q.dequeue();
          node.content = q.run("</script");
          node.endTag = "script";
          list.push(node);
        }
      } else if (q.peek() == ">") {
        q.dequeue();
        node.addChildren(this.internalParse(node));
        node.setEndIndex(this.index, this.source);
        list.push(node);
      } else {
        let text = "";

        while (q.any()) {
          text += q.dequeue();
          if (q.any() && q.peek() == "<") break;
        }
        if (text.trim().length === 0) {
          if (this.options.ignoreWhitespace === false) {
            list.push(HtmlNode.CreateWhiteSpace(text));
          }
        } else {
          list.push(HtmlNode.CreateText(text));
        }
      }
    }

    return list;
  }

  getAttributes(): HtmlNodeAttributes {
    const GetAttribute = (): KeyValuePair<string, string> => {
      const name = this.q.run("=", " ", ">");

      if (q.peek() == " ") return new KeyValuePair<string, string>(name);

      this.q.dequeue();

      if (q.any()) {
        // attr=value is valid so check for the scenerio
        if (q.peek() == "'" || q.peek() == '"') {
          const del = this.q.dequeue();
          const value = this.q.run(del);
          this.q.dequeue();
          return new KeyValuePair<string, string>(name, value);
        } else {
          const value = this.q.run(" ", ">", "<", "'", '"', "=", "`");
          return new KeyValuePair<string, string>(name, value);
        }
      }

      return new KeyValuePair<string, string>(name);
    };

    const attrs: HtmlNodeAttributes = {};
    const { q } = this;
    if (q.isEmpty()) return attrs;

    if (q.peek() == "/") return attrs;

    q.skipSpace();

    do {
      const kv = GetAttribute();
      attrs[kv.key] = kv.value; //.set(kv.key, kv.value);
      q.skipSpace();
    } while (q.any() && q.peek() != ">" && q.peek(2) != "/>");

    return attrs;
  }

  getTagName(): string {
    return this.q.run(" ", ">", "/", "\r", "\n");
  }

  getComment(): string {
    this.q.dequeue(4);
    const text = this.q.run("-->");
    this.q.dequeue(3);
    return text;
  }
}
