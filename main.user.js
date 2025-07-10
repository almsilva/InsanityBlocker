import { initPrune } from "./insanity_blocker.js";

("use strict");

/*
 * Blacklist of keywords, text fragments and even regexs, separated by comma.
 * E.g.: 'war', 'crime', '\\bracism'
 */
const blacklist = [];

/*
 * Entry point that triggers the prune logic once the page is loaded.
 * It waits 1 second after the event is triggered to give time to
 * pages to finish to rendering its content.
 */
window.addEventListener("load", () => {
  setTimeout(() => {
    initPrune(document.body, blacklist, window);
  }, 1000);
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
