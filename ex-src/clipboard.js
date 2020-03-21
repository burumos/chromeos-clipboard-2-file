const KEY = 'is_enable';
function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function(result) {
      resolve(result[key]);
    });
  })
}
let isEnable = true;
// 利用可否の初期値取得
get(KEY).then(result => isEnable = result);
// 利用可否の変更を監視
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (KEY in changes) {
    isEnable = changes[KEY].newValue;
    // console.log('change', isEnable);
  }
});


const textarea = document.body.appendChild(document.createElement('textarea'));
let style = {
  position: 'fixed',
  top: '-300px',
}
Object.entries(style).forEach(([key, value]) => {
  textarea.style[key] = value;
});


function paste() {
  textarea.value = '';
  textarea.focus();
  document.execCommand('paste');
  sendCopiedText(textarea.value);
}

function sendCopiedText(text) {
  // console.log('cliboard send', text);
  window.fetch("http://localhost:8123", {
    method: 'post',
    credential: 'omit',
    "Content-Type": 'application/json; charset=utf-8',
    body: JSON.stringify({text}),
  }).catch(e => null)
}

