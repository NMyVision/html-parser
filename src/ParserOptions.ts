export type ParserOptions = {
  /**
  * Ignore whitespace when parsing. This should only affect whitespace outside elements.
  */
  ignoreWhitespace: boolean;

  /**
  * These tags can be parsed as self closing tags without the '/' example <hr> instead of <hr />.
  */
  selfClosingTags: string[];
};

export const defaultSelfClosingTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"]

export const defaultParserOptions: ParserOptions = {
  ignoreWhitespace: true,
  selfClosingTags: defaultSelfClosingTags
};
