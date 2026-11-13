// ============================================================
// PTA 代码框一键填入脚本
//
// 用法：
//   1. 在 PTA 做题页面按 F12，切到 "Console"（控制台）
//   2. 如果提示 "Don't paste code in DevTools console"，在输入行
//      手动敲  allow pasting  然后回车（只需一次）
//   3. 把本文件全部内容复制，粘贴进控制台，回车
//   4. 弹出输入框，把你的代码粘进去，确认
//   5. 代码就出现在 PTA 的代码框里了，点"提交本题作答"
//
// 原理：PTA 的"禁用粘贴"只拦截浏览器粘贴事件。
//       本脚本不走粘贴，而是直接调用编辑器(CodeMirror 6)的
//       内部接口 dispatch()，把代码写进文档。拦截器碰不到。
// ============================================================

(function () {
  // 找到可编辑的代码框（页面上有多个 CodeMirror，只有代码框 contenteditable=true）
  const editors = [...document.querySelectorAll('.cm-content')]
    .filter(e => e.getAttribute('contenteditable') === 'true');

  if (editors.length === 0) {
    alert('没找到代码框。请确认你已经打开到某道题的作答页面，且左侧语言选了 C (gcc)。');
    return;
  }

  // 页面有多处编辑框时，选高度最大的那个（就是代码区）
  const el = editors.sort(
    (a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height
  )[0];

  const view = el.cmTile && el.cmTile.view;
  if (!view) {
    alert('编辑器接口没找到。可能是 PTA 改版了，需要更新脚本。');
    return;
  }

  // 弹输入框，让用户粘代码
  const code = prompt('把代码粘到下面（Ctrl+V），然后点确定：');
  if (code === null || code === '') return;

  // 核心：直接写入编辑器文档
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: code }
  });

  console.log('[PTA填入] 成功写入 ' + code.length + ' 个字符');
})();
