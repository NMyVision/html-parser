import { HtmlParser } from "./src/HtmlParser.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const hp = new HtmlParser();
  const result = hp.parse(`<article id="editor"/>`);
  console.log(result);
}
