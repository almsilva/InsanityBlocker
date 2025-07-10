
// ==UserScript==
// @name        InsanityBlocker
// @version     0.1
// @namespace   http://tampermonkey.net/
// @description Block content of a page based on a blacklist of keywords.
// @match       ://*/*
// @grant       none
// ==/UserScript==
(function () {
  'use strict';

  function initPrune(node, blacklist, window) {
    if (!node || !blacklist) return;
    pruneNode(node, blacklist, window);
    for (const child of node.querySelectorAll("*")) {
      pruneNode(child, blacklist, window);
    }
  }
  function pruneNode(node, blacklist, window) {
    if (!node || !blacklist) return;
    if (hasBlacklistedWord(node, blacklist)) {
      const nodeToBlock = findBestAncestorToReplace(node, window);
      blockNode(nodeToBlock, window);
    }
  }
  function hasBlacklistedWord(node, blacklist) {
    if (!node || typeof node.textContent !== "string") return false;
    if (!blacklist) return false;
    if (!isLeafNode(node)) return false;
    return blacklist.some(word => {
      const regex = new RegExp(word, "i");
      return regex.test(getVisibleText(node));
    });
  }
  function findBestAncestorToReplace(node, window) {
    const invalidTags = ["A", "P", "LI", "SPAN", "BUTTON", "LABEL", "B", "I", "LEGEND", "FIELDSET"];
    const invalidDisplay = ["inline", "none"];
    const matchingNodeText = getVisibleText(node);
    let parent = node.parentElement;
    let previousNode = node;
    while (parent && parent.tagName != "BODY") {
      let parentText = getVisibleText(parent);
      const matchingNodeContentTextRatio = matchingNodeText.length / parentText.length;
      if (matchingNodeContentTextRatio < 0.5) {
        do {
          let computedNodeStyle = window.getComputedStyle(previousNode);
          let isVisibleBlock = !invalidDisplay.includes(computedNodeStyle.display);
          let allowedTag = !invalidTags.includes(previousNode.tagName);
          if (!isVisibleBlock || !allowedTag) {
            previousNode = parent;
            parent = parent.parentElement;
          } else {
            break;
          }
        } while (parent.tagName != "BODY");
        break;
      }
      previousNode = parent;
      parent = parent.parentElement;
    }
    return previousNode;
  }
  function blockNode(node, window) {
    let existingBlocker = node.querySelectorAll(".insanityBlocked");
    if (!existingBlocker || !existingBlocker.length == 0) {
      return;
    }
    const blockingDiv = window.document.createElement("div");
    const messageDiv = window.document.createElement("div");
    blockingDiv.appendChild(messageDiv);
    messageDiv.textContent = "Content blocked by InsanityBlocker.";
    const clickToShow = window.document.createElement("div");
    blockingDiv.appendChild(clickToShow);
    clickToShow.textContent = "Click to show";
    Object.assign(clickToShow.style, {
      color: "silver",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: "0.8em"
    });
    clickToShow.addEventListener("click", event => {
      let parent = event.target.parentElement;
      if (parent) {
        parent.style.display = "none";
      }
    });
    blockingDiv.className = "insanityBlocked";
    Object.assign(blockingDiv.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      border: "1px dashed silver",
      color: "silver",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      zIndex: "9999",
      pointerEvents: "auto",
      fontWeight: "normal",
      fontSize: "0.9em !important",
      fontFamily: "sans-serif"
    });
    const computedStyle = window.getComputedStyle(node);
    if (computedStyle.position === "static") {
      node.style.position = "relative";
    }
    node.appendChild(blockingDiv);
  }
  function getVisibleText(node) {
    return node.textContent.trim().replace(/\s+/g, " ");
  }
  function isLeafNode(node) {
    return !node?.children || node.children.length === 0;
  }

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
  const nodeObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        initPrune(node, blacklist, window);
      }
    }
  });
  nodeObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
