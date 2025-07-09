import { initPrune } from "./insanity_blocker.js";

("use strict");

const blacklist = [
  // Your blacklist of keywords, text fragments and even regexs.
  // E.g.: 'war', 'crime', 'drugs'
];

/*
 * Entry point that triggers the prune logic once the page is loaded.
 */
window.addEventListener("load", () => {
  initPrune(document.body, blacklist, window);
});

/*
 * Entry point that triggers the prune logic anytime that a node is added to the document.
 */
const nodeObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      initPrune(node, blacklist, window);
    }
  }
});

nodeObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
