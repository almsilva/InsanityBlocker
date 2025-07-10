# Insanity Blocker

## Introduction

I am done being triggered or overwhelmed by content intentionally written to provoke strong emotional reactions and driven by increasingly hostile agendas against common people. These types of content are designed to cause anxiety, anger, sadness, and a deep sense of hopelessness — gradually corroding our faith in the future. And being realistic, there is absolutely nothing we can do about many of the things already in motion. So, there's no point in consuming such toxic content.

Enough is enough! Just like I use an AdBlocker to preserve my consumer choices and decisions, I need a content blocker to protect myself from all this insanity — an **Insanity Blocker**.

This project aims to provide a way to block content based on keywords, text fragments, and regular expressions while I browse the internet, allowing me to focus only on what isn’t toxic for me.

## How does it work?

In an objective way, what I am developing is a user script (like the ones used with Greasemonkey, Tampermonkey, etc.) that is executed when a page is loaded and look for leaf nodes (html nodes without children) which contains any of the keyworks, text fragments or regex present in a coma separated blacklist defined by the user.

Once it finds a match, it looks up in the document structure looking for a parent node where (1) up to 50% of the textual content at that level is composed by the text where the blacklisted content was found, (2) the parent is visible, (3) it is not an in-line element and (4) it is not the body of the document.

Once those criteria are match, an overlay div covering the entire content. It can take couple seconds before it kicks in to give time to scripts and engines to finish to properly render the page. The important thins if that **the content is never deleted or changed** and can be displayed at any time.

This is repeat when new nodes are dynamically added to the document.At its core, this is a user script (compatible with tools like **Greasemonkey**, **Tampermonkey**, etc.) that runs when a webpage loads. It searches for **leaf nodes** (HTML nodes with no children) containing any of the keywords, text fragments, or regex patterns defined by the user in a comma-separated blacklist.

Once a match is found, the script traverses the DOM hierarchy to locate a parent node that satisfies the following conditions:

1. Up to 50% of the visible text at that level contains the blacklisted content.
2. The parent is visible.
3. The parent is not an inline element.
4. The parent is not the `<body>` element.

Once these criteria are met, an **overlay `<div>`** is placed over the matched content, effectively blocking it. The script allows a few seconds after page load to give other scripts and rendering engines time to complete. Importantly, **no content is deleted or modified**, and it can be revealed at any time if desired.

This behavior also applies to dynamically inserted content.

## How can you use it?

Assuming that you're already familiar with tools like [Tamper Monkey](https://www.tampermonkey.net/) and [Violent Monkey](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), there are two main ways to use the **Insanity Blocker**:

### 1. Copy and paste the user script content.

You can copy-and-paste the content of `dist/insanity_blocker.user.js` and customize the black list defined in the following statement:

You can manually copy the contents of `dist/insanity_blocker.user.js` into a new user script, and customize the blacklist defined in this section:

```js
/*
 * Blacklist of keywords, text fragments and even regex patterns, separated by commas.
 * E.g.: 'war', 'crime', '\\bracism'
 */
const blacklist = [];
```

For example, if you want to block content related to `violence`, `drugs` and `war`:

```javascript
/*
 * Blacklist of keywords, text fragments and even regexs, separated by comma.
 * E.g.: 'war', 'crime', '\\bracism'
 */
const blacklist = ["violence", "drugs", "war"];
```

Matching is **case-insensitive**, so there's no need to worry about letter casing.

### 2. Importing the script via URL.

- For **Tamper Monkey** you can follow the instructions [available here](https://gist.github.com/jesterjunk/0344f1a7c1f67f52ffc716b17ee7f240).

- As of the time of writing, **Violent Monkey** seems to not support importing via URL, but it's worth keeping an eye on their [official documentation](http://violentmonkey.com/how-do-i-install-a-userscript-in-violentmonkey/).

## How can you colaborate?

You are more than welcome to fork this repository and modify as you like. Here's what you need:

| Package | Version  | Reason                                     |
| ------- | -------- | ------------------------------------------ |
| NodeJS  | v22.16.0 | Local runtime for development and testing. |
| NPM     | 10.9.2   | Manage dependencies and automate tasks.    |

### Project structure:

```
/insanity_blocker               <-- Project root
   /coverage                    <-- Coverage report output
   /dist                        <-- Final build
      insanity_blocker.user.js  <-- Bundled user script
   /tests                       <-- Unit tests
   main.user.js                 <-- Entry point for user script
   insanity_blocker.js          <-- Core blocking logic
   package.json                 <-- Dependencies and scripts
   eslint.confi.js              <-- ESLint config
   jest.config.js               <-- Jest config
   jest.setup.js                <-- Jest environment setup
   metadata.json                <-- Metadata for the user script header
   rollup.config.mjs            <-- RollUp bundler config
```

### Tooling and dependencies

| Library  | Purpose                                             |
| -------- | --------------------------------------------------- |
| Jest     | Unit tests and coverage reports.                    |
| JDOM     | DOM emulation for unit tests.                       |
| ESLint   | Static code analysis (still a working in progress). |
| Prettier | Code formatting.                                    |
| RollUp   | Bundles the user script and blocking module.        |

### Available tasks

| Task   | Command          | Purpose                                                                                        |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------- |
| Test   | `npm test`       | Runs unit tests and updates coverage report.                                                   |
| Format | `npm run format` | Formats all code files using _Prettier_.                                                       |
| Lint   | `npm run lint`   | Runs ESLint to catch code smells and potential bugs.                                           |
| Build  | `npm run build`  | Bundles `metadata.json`, `insanity_blocker.js` and `main.user.js` into the finale user script. |

## Licensing.

This project is published under the [MIT License](https://mit-license.org/).
