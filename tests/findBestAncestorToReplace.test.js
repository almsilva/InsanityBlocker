import { findBestAncestorToReplace } from "../insanity_blocker";
import { JSDOM } from "jsdom";

describe("Select the best node to replace.", () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(`
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

    document = dom.window.document;
  });

  test("returns parent container where the text represents more than 70% of the text..", () => {
    let node = document.querySelector("#targetText");
    let expectedResult = document.querySelector("#containsText");

    expect(findBestAncestorToReplace(node)).toBe(expectedResult);
  });
});
