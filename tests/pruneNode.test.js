import { pruneNode } from "../insanity_blocker";
import { JSDOM } from "jsdom";

describe("Pruning a node potentially containing a blacklisted word", () => {
  let window;

  beforeEach(() => {
    const document = new JSDOM(`
            <html>
               <body>
                    <div class="container">
                        <div class="row" id="containsText">
                            <div class="col">
                                <img src="image_to_hide.png" alt="Image to hide."/>
                            </div>
                            <div class="col" id="targetText">
                                This is a text about politics.
                            </div>
                        </div>
                        <div class="row" id="doesNotContainsText">
                            <div class="col">
                                <img src="image_to_show.png" alt="Image to show."/>
                            </div>
                            <div class="col">
                                This is a text that does not talk about politics.
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);

    window = document.window;
  });

  test("prune leaf node containing blacklisted word", () => {
    let node = window.document.querySelector("#targetText");
    pruneNode(node, ["politics"], window);

    let blockedNode = window.document.querySelector(".insanityBlocked");
    expect(blockedNode).not.toBeNull();
    expect(blockedNode.parentNode.id).toBe("containsText");
  });

  test("prune non-leaf node containing blaclisted word", () => {
    let node = window.document.querySelector("#containsText");
    pruneNode(node, ["politics"], window);

    let blockedNode = window.document.querySelector(".insanityBlocked");
    expect(blockedNode).toBeNull();
  });
});
