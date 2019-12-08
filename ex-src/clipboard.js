
const textarea = document.body.appendChild(document.createElement('textarea'));
let style = {
  position: 'fixed',
  top: '-300px',
}
Object.entries(style).forEach(([key, value]) => {
  textarea.style[key] = value;
});

document.addEventListener('keydown', (e) => {
  const ctrlDown = e.ctrlKey;
  const keyCode = e.code;
  if (ctrlDown && keyCode === 'KeyC') {
    window.setTimeout(() => {
      checkAndSendClipboard();
    }, 0);
  }
})

document.addEventListener('mouseup', e => {
  const tagName = e.target.tagName.toLowerCase();
  if (tagName !== 'select') {
      checkAndSendClipboard();
  }
})

const checkAndSendClipboard = () => {
  const activeElement = document.activeElement;
  const activeElementTagName = activeElement.tagName.toLowerCase();
  const selectObj = window.getSelection();

  if (('textarea' === activeElementTagName
       || ('input' === activeElementTagName
           && ['text', 'search'].includes(activeElement.type)))
      && selectObj.anchorNode
      && undefined !== selectObj.anchorNode.tagName) {
    const startOffset = activeElement.selectionStart;
    const endOffset = activeElement.selectionEnd;
    paste();
    activeElement.focus();
    activeElement.selectionStart = startOffset;
    activeElement.selectionEnd = endOffset;
  } else if ('input' === activeElementTagName) {
    // selectionを取得する方法がわからんので、あきらめ...
  } else if (activeElementTagName !== 'iframe') {
    const startNode = selectObj.anchorNode;
    const startOffset = selectObj.anchorOffset;
    const endNode = selectObj.focusNode;
    const endOffset = selectObj.focusOffset;
    paste();
    selectObj.removeAllRanges();
    const range = document.createRange();
    if (startNode) range.setStart(startNode, startOffset);
    if (endNode) range.setEnd(endNode, endOffset);
    selectObj.addRange(range);
  }

};


function paste() {
  textarea.value = '';
  textarea.focus();
  document.execCommand('paste');
  sendCopiedText(textarea.value);
}

function sendCopiedText(text) {
  window.fetch("http://localhost:8123", {
    method: 'post',
    credential: 'omit',
    "Content-Type": 'application/json; charset=utf-8',
    body: JSON.stringify({text}),
  }).catch(e => null)
}

