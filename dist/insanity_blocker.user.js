
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
    if (!node) return;
    pruneNode(node, blacklist, window);
    for (const child of node.querySelectorAll("*")) {
      pruneNode(child, blacklist, window);
    }
  }
  function pruneNode(node, blacklist, window) {
    if (!node) return;
    if (!blacklist) return;
    if (hasBlacklistedWord(node, blacklist)) {
      const nodeToBlock = findBestAncestorToReplace(node);
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
  function findBestAncestorToReplace(node) {
    const matchingNodeText = getVisibleText(node);
    let parent = node.parentElement;
    let previousNode = node;
    while (parent && parent.tagName != "BODY") {
      let parentText = getVisibleText(parent);
      const matchingNodeContentTextRatio = matchingNodeText.length / parentText.length;
      if (matchingNodeContentTextRatio < 0.7) {
        break;
      }
      previousNode = parent;
      parent = parent.parentElement;
    }
    return previousNode;
  }
  function blockNode(node, window) {
    const blockingDiv = window.document.createElement("div");
    const messageDiv = window.document.createElement("div");
    blockingDiv.appendChild(messageDiv);
    messageDiv.textContent = "Content blocked by InsanityBlocker.";
    messageDiv.style.display = "block";
    const clickToShow = window.document.createElement("div");
    blockingDiv.appendChild(clickToShow);
    clickToShow.textContent = "Click to show";
    clickToShow.style.color = "blue";
    clickToShow.style.textDecoration = "underline;";
    clickToShow.style.cursor = "pointer";
    clickToShow.style.display = "block";
    clickToShow.style.fontSize = "0.8em";
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
      backgroundColor: "#e9e9e9",
      border: "1px dotted gray",
      color: "gray",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      zIndex: "9999",
      pointerEvents: "auto",
      fontWeight: "normal",
      fontSize: "0.9em",
      fontFamily: "sans-serif",
      borderRadius: "7px"
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
    return !node || node.children.length === 0;
  }

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
