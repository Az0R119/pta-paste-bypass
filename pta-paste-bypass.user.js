// ==UserScript==
// @name         PTA Paste Bypass
// @namespace    https://github.com/Az0R119/pta-paste-bypass
// @version      1.0.0
// @description  Insert code into PTA's editor bypassing the "paste disabled" restriction
// @author       Az0R119
// @match        https://pintia.cn/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

/*
 * PTA (pintia.cn) blocks Ctrl+V with a "code pasting is disabled" message.
 * That restriction only intercepts the browser's paste event.
 *
 * PTA's editor is CodeMirror 6. Its real content lives in an EditorView
 * object, not in the DOM. Writing through the editor's own API never
 * touches the paste event chain, so the interceptor is not reached.
 *
 *   .cm-content  ->  el.cmTile.view  ->  view.state.doc   (the real text)
 *
 * This script exposes a global helper and adds a floating button.
 */

(function () {
  'use strict';

  /** Find PTA's editable code editor. Returns the EditorView or null. */
  function getView() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('.cm-content')
    ).filter(function (el) {
      return el.getAttribute('contenteditable') === 'true';
    });

    if (!nodes.length) return null;

    // Several editors can exist on one page. The code box is the tallest one.
    nodes.sort(function (a, b) {
      return b.getBoundingClientRect().height - a.getBoundingClientRect().height;
    });

    for (var i = 0; i < nodes.length; i++) {
      var view = nodes[i].cmTile && nodes[i].cmTile.view;
      if (view && view.state && view.state.doc && typeof view.dispatch === 'function') {
        return view;
      }
    }
    return null;
  }

  /**
   * Replace the editor content with `code`.
   * Returns true on success, false if no editor was found.
   */
  function setCode(code) {
    var view = getView();
    if (!view) return false;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: code }
    });
    return true;
  }

  /** Read the current editor content. */
  function getCode() {
    var view = getView();
    return view ? view.state.doc.toString() : null;
  }

  // Expose for console use:  ptaSetCode('...')  /  ptaGetCode()
  window.ptaSetCode = setCode;
  window.ptaGetCode = getCode;

  // ---- Optional floating button -------------------------------------------
  // Only shown on pages that actually contain an editable editor.

  var btn = null;

  function makeButton() {
    btn = document.createElement('button');
    btn.textContent = 'Insert code';
    btn.title = 'Paste code into the editor (bypasses paste restriction)';
    btn.style.cssText = [
      'position:fixed', 'right:16px', 'bottom:16px', 'z-index:2147483647',
      'padding:10px 16px', 'border-radius:8px', 'border:none',
      'background:#1677ff', 'color:#fff', 'font-size:14px',
      'font-family:system-ui,sans-serif', 'cursor:pointer',
      'box-shadow:0 2px 8px rgba(0,0,0,.25)'
    ].join(';');

    btn.addEventListener('click', function () {
      var code = window.prompt(
        'Paste your code below, then press OK:\n\n(Tip: ptaSetCode(str) works too)'
      );
      if (code === null || code === '') return;
      if (setCode(code)) {
        console.log('[PTA Paste Bypass] inserted ' + code.length + ' characters');
      } else {
        alert('Editor not found. Open a problem page and pick a language first.');
      }
    });

    document.body.appendChild(btn);
  }

  function sync() {
    var hasEditor = !!getView();
    if (hasEditor && !btn) makeButton();
    if (!hasEditor && btn) { btn.remove(); btn = null; }
  }

  // PTA is a single-page app: the editor appears and disappears on navigation.
  window.addEventListener('load', sync);
  setInterval(sync, 1000);
})();
