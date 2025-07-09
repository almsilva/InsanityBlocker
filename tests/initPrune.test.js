import { initPrune } from "../insanity_blocker";
import { JSDOM } from "jsdom";

describe("Initing the pruning process in node and its children", () => {
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

  test("pruning starting from the body node", () => {
    let node = window.document.querySelector("body");
    initPrune(node, ["politics"], window);

    let blockedDiv = window.document.querySelector(".insanityBlocked");
    expect(blockedDiv).not.toBeNull();
    expect(blockedDiv.parentElement.id).toBe("containsText");
  });

  test("pruning starting from leaf node", () => {
    let node = window.document.querySelector("#targetText");
    initPrune(node, ["politics"], window);

    let blockedDiv = window.document.querySelector(".insanityBlocked");
    expect(blockedDiv).not.toBeNull();
    expect(blockedDiv.parentElement.id).toBe("containsText");
  });
});
