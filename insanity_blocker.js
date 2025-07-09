export function initPrune(node, blacklist, window) {
  if (!node) return;

  pruneNode(node, blacklist, window);
  for (const child of node.querySelectorAll("*")) {
    pruneNode(child, blacklist, window);
  }
}

export function pruneNode(node, blacklist, window) {
  if (!node) return;
  if (!blacklist) return;
  if (hasBlacklistedWord(node, blacklist)) {
    const nodeToBlock = findBestAncestorToReplace(node);
    blockNode(nodeToBlock, window);
  }
}

export function hasBlacklistedWord(node, blacklist) {
  if (!node || typeof node.textContent !== "string") return false;
  if (!blacklist) return false;
  if (!isLeafNode(node)) return false;

  return blacklist.some((word) => {
    const regex = new RegExp(word, "i");
    return regex.test(getVisibleText(node));
  });
}

export function findBestAncestorToReplace(node) {
  const matchingNodeText = getVisibleText(node);
  let parent = node.parentElement;
  let previousNode = node;

  while (parent && parent.tagName != "BODY") {
    let parentText = getVisibleText(parent);
    const matchingNodeContentTextRatio =
      matchingNodeText.length / parentText.length;
    if (matchingNodeContentTextRatio < 0.7) {
      break;
    }

    previousNode = parent;
    parent = parent.parentElement;
  }

  return previousNode;
}

export function blockNode(node, window) {
  const blockingDiv = window.document.createElement("div");

  const messageDiv = window.document.createElement("div");
  blockingDiv.appendChild(messageDiv);
  messageDiv.textContent = "Content blocked by InsanityBlocker.";
  messageDiv.style.display = "block";

  const clickToShow = window.document.createElement("div");
  blockingDiv.appendChild(clickToShow);
  clickToShow.textContent = "Click to show";
  clickToShow.style.color = "blue";
  clickToShow.style.textDecoration = "underline;"
  clickToShow.style.cursor = "pointer";
  clickToShow.style.display = "block";
  clickToShow.style.fontSize = "0.8em";
  clickToShow.addEventListener("click", (event) => {
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
    borderRadius: "7px",
  });

  const computedStyle = window.getComputedStyle(node);
  if (computedStyle.position === "static") {
    node.style.position = "relative";
  }

  node.appendChild(blockingDiv);
}

export function getVisibleText(node) {
  return node.textContent.trim().replace(/\s+/g, " ");
}

export function isLeafNode(node) {
  return !node || node.children.length === 0;
}
