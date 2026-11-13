# PTA Paste Bypass

Bypass the "code pasting is disabled" restriction on [PTA](https://pintia.cn) (拼题A / Pintia), so you can write code in your editor of choice and paste it in.

Works on Chrome, Edge, and any Chromium browser. No extension required if you use the console method.

## Why the usual tricks fail

PTA's editor is **CodeMirror 6**. Its content does not live in the DOM — it lives in an `EditorView` object. That is why:

| Approach | Result | Reason |
|---|---|---|
| `Ctrl+V` | Blocked | Triggers the paste event, which PTA intercepts |
| "Don't Fuck With Paste"-style extensions | Unreliable | They patch DOM events; PTA also guards inside the editor |
| Editing `.cm-content` text in DevTools | Lost on repaint | The DOM changes, but CodeMirror's internal document does not |
| **Calling `view.dispatch()`** | Works | Uses the editor's own programmatic API, bypassing the event chain entirely |

The real text path is:

```
.cm-content element  ->  el.cmTile.view  ->  view.state.doc
```

## Usage

### Option A — Console (no install)

1. Open the PTA problem page, press `F12`, switch to **Console**
2. If Chrome warns `Don't paste code in DevTools console`, type `allow pasting` by hand and press Enter (once per browser profile)
3. Paste this and press Enter:

```js
const el = [...document.querySelectorAll('.cm-content')]
  .filter(e => e.getAttribute('contenteditable') === 'true')
  .sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];

el.cmTile.view.dispatch({
  changes: { from: 0, to: el.cmTile.view.state.doc.length, insert: 'YOUR CODE HERE' }
});
```

Replace `YOUR CODE HERE` with your code. For multi-line code, use backticks:

```js
insert: `#include <stdio.h>
int main() { return 0; }`
```

Then click **提交本题作答** (Submit).

### Option B — Tampermonkey userscript (install once)

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Open [`pta-paste-bypass.user.js`](pta-paste-bypass.user.js) and click **Raw** — Tampermonkey will offer to install it
3. A blue **Insert code** button appears at the bottom-right of any PTA problem page

Two global helpers are also exposed in the console:

```js
ptaSetCode('your code')   // replace editor content
ptaGetCode()              // read current content
```

## How it works

`view.dispatch({changes})` is CodeMirror's official programmatic editing API. It is the same internal path a real keystroke takes, minus the keyboard and paste events. PTA's interceptor listens on `paste`, so it never fires.

The script finds the editor by walking `.cm-content` elements with `contenteditable="true"` and reading the non-public `cmTile.view` property. When a page holds several editors (problem description, test cases, the code box), it picks the tallest one.

## Limitations

- Depends on CodeMirror 6's `cmTile.view` property, which is not part of CodeMirror's public API. If PTA upgrades or switches editors, the selector may need updating — open an issue if that happens.
- The `contenteditable="true"` filter is what distinguishes the real code box from read-only CodeMirror instances used for problem statements and sample tests.
- Only affects the current page. Nothing is stored and no network requests are made.

## Disclaimer

This is a tool for getting locally-written code into a web editor. It does not change what you submit.

Respect your course rules. If your instructor requires you to type code on the spot without an IDE, using this violates that rule.

## License

MIT
