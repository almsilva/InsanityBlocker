import { hasBlacklistedWord } from "../insanity_blocker";
import { JSDOM } from "jsdom";

describe("Does a node contains a black listed word?", () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(`
            <html>
                <body>
                    <script>
                        debug.console('Node without text.');
                    </script>
                    <p>
                        <small>This is a content about politic.</small>
                    </p>
                    <span>Another paragraph.</span>
                </body>
            </html>
        `);

    document = dom.window.document;
  });

  test("ignores null as node.", () => {
    expect(hasBlacklistedWord(null, ["politic"])).toBe(false);
  });

  test("ignores null as blacklist.", () => {
    const node = document.querySelector("p");
    expect(hasBlacklistedWord(node, null)).toBe(false);
  });

  test("ignores node without text.", () => {
    const node = document.querySelector("script");
    expect(hasBlacklistedWord(node, null)).toBe(false);
  });

  test("does not detect the text when the node is not a leaf node.", () => {
    const node = document.querySelector("p");
    expect(hasBlacklistedWord(node, ["politic"])).toBe(false);
  });

  test("detects the text when the node is a leaf node.", () => {
    const node = document.querySelector("small");
    expect(hasBlacklistedWord(node, ["politic"])).toBe(true);
  });

  test("does not detect the node that does not contains the content about politic.", () => {
    const node = document.querySelector("span");
    expect(hasBlacklistedWord(node, ["politic"])).toBe(false);
  });

  test("does not detect variations of black listed words.", () => {
    const node = document.querySelector("small");
    expect(hasBlacklistedWord(node, ["politics"])).toBe(false);
  });

  test("does match text using regex.", () => {
    const node = document.querySelector("small");
    expect(hasBlacklistedWord(node, ["\\bpo.*"])).toBe(true);
  });
});
