import { blockNode } from "../insanity_blocker";
import { JSDOM } from "jsdom";

describe("Blocking node content.", () => {
  let window;

  beforeEach(() => {
    const dom = new JSDOM(`
            <html>
                <body>
                    <div class="container">
                        <div class="row" id="toBeBlocked">
                            <div class="col">
                                <img src="image_to_block.png" alt="This image must be blocked."/>
                                <p>This entire content must be blocked.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);

    window = dom.window;
  });

  test("append an overlay to the selected container.", () => {
    let node = window.document.querySelector("#toBeBlocked");
    blockNode(node, window);

    let blockingNode = window.document.querySelector(
      "#toBeBlocked > .insanityBlocked",
    );
    expect(blockingNode).not.toBeNull();
    expect(blockingNode.parentNode).toBe(node);
    expect(blockingNode.textContent).toBe(
      "Content blocked by InsanityBlocker.Click to show",
    );
  });
});
