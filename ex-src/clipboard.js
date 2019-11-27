
document.addEventListener('copy', e => {
  const elem = e.target;
  const tagName = elem.tagName;
  if (tagName === 'INPUT' || tagName === "TEXTAREA") {
    const start = elem.selectionStart;
    const end = elem.selectionEnd;
    const selectedText = elem.value.slice(start, end);
    console.log('input', selectedText);
    sendCopiedText(selectedText);
  } else {
    const selectedText = window.getSelection().toString();
    console.log('text', selectedText);
    sendCopiedText(selectedText);
  }
})

function sendCopiedText(text) {
  fetch("http://localhost:8123", {
    method: 'post',
    credential: 'omit',
    "Content-Type": 'application/json; charset=utf-8',
    body: JSON.stringify({text}),
  }).catch(e => e)
}
