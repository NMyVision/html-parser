import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { HtmlParser } from "../src/HtmlParser.ts";
import { assertSnapshot } from "@std/testing/snapshot";

describe("HtmlParser Tests", () => {
  test("simple test", async (t) => {
    const hp = new HtmlParser();

    const html = "<div />";

    const result = hp.parse(html)[0];

    await assertSnapshot(t, result);

    expect(result.tag).toEqual("div");

    expect(result.outerHTML).toEqual(html);
  });

  test("attribute test", async (t) => {
    const hp = new HtmlParser();

    const html = "<input disabled required type='text' />";

    const result = hp.parse(html)[0];

    await assertSnapshot(t, result);

    expect(result.tag).toEqual("input");

    expect(Object.keys(result.attributes as object).length).toEqual(3);

    expect(result.attributes?.type).toEqual("text");

    expect(result.outerHTML).toEqual(html);
  });

  test("attribute test", async (t) => {
    const hp = new HtmlParser();

    const innerHtml = `<input disabled required type='text' />`;

    const html = `<div>${innerHtml}</div>`;

    let result = hp.parse(html)[0];

    await assertSnapshot(t, result);

    expect(result.tag).toEqual("div");

    expect(Object.keys(result.attributes as object).length).toEqual(0);

    expect(result.outerHTML).toEqual(html);

    result = result.children[0];

    expect(result.tag).toEqual("input");

    expect(Object.keys(result.attributes as object).length).toEqual(3);

    expect(result.attributes?.type).toBeTruthy();

    expect(result.attributes?.type).toEqual("text");

    expect(result.outerHTML).toEqual(innerHtml);
  });

  test("incomplete sample", async (t) => {
    const hp = new HtmlParser();

    let result = hp.parse(`<article id="edito`);

    await assertSnapshot(t, result);

    expect(result[0].tag).toEqual("article");

    expect(result[0]?.attributes?.id).toEqual("edito");

    result = hp.parse(`<article id="editor"`);

    expect(result[0].tag).toEqual("article");

    expect(result[0]?.attributes?.id).toEqual("editor");
  });

  test("vue sample", () => {
    const vue = `<article id="editor">
  <textarea :value="input" @input="update"></textarea>
  <div v-html="compiledMarkdown"></div>
</article>`;

    const hp = new HtmlParser();

    const result = hp.parse(vue);

    let el = result[0];
    expect(el.tag).toEqual("article");

    el = result[0].children[0];

    expect(el.tag).toEqual("textarea");
    expect(Object.values(el.attributes as object).length).toEqual(2);

    el = result[0].children[1];
    expect(el.tag).toEqual("div");
    expect(Object.values(el.attributes as object).length).toEqual(1);
  });

  test("vue multiline sample", () => {
    const vue = `<article id="editor">
  <textarea
    :value="input"
    @input="update => alert('Ok')"
    >Some Content</textarea>
  <div v-html="compiledMarkdown"></div>
</article>`;

    const hp = new HtmlParser();

    const result = hp.parse(vue);

    let el = result[0];
    expect(el.tag).toEqual("article");

    el = result[0].children[0];

    expect(el.tag).toEqual("textarea");
    expect(el.children[0].content).toEqual("Some Content");
    expect(Object.values(el.attributes as object).length).toEqual(2);

    el = result[0].children[1];
    expect(el.tag).toEqual("div");
    expect(Object.values(el.attributes as object).length).toEqual(1);
  });

  test("jsx sample", async (t) => {
    const jsx = `<fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>`;

    const hp = new HtmlParser();

    const result = hp.parse(jsx);

    await assertSnapshot(t, result);
  });

  test("index.html sample", () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tailwindcss/ui@latest/dist/tailwind-ui.min.css">
<style>
html {
  --scrollbarBG: #ebeff1;
  --thumbBG: #CFD8DC;
}
</style>
</head>
<!-- this is a comment -->
<body class="min-h-screen">
  <div id="app" class="min-h-screen"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;

    const hp = new HtmlParser();

    const result = hp.parse(html);

    expect(result[0].type).toEqual(0);

    expect(result[1].type).toEqual(3);

    JSON.stringify(result);
  });
});
