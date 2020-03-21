const KEY = 'is_enable';
const ON_IMAGE = 'file-copy-24dp-2.png';
const OFF_IMAGE = 'file-copy-24dp-1.png';

function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function(result) {
      // console.log('Value currently is ' + result[key]);
      resolve(result[key]);
    });
  })
}
function set(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({[key]: value}, function() {
      // console.log('Value is set to ' + value);
      resolve(value);
    });
  })
}

const toggleState = async (isEnable=null) => {
  const state = await get(KEY);
  const isAssign = typeof isEnable === 'boolean';
  if ((isAssign && !isEnable) || state) {
    chrome.browserAction.setIcon({path: OFF_IMAGE})
    chrome.browserAction.setTitle({title: "clipboard sync OFF"})
    set(KEY, false);
  } else {
    chrome.browserAction.setIcon({path: ON_IMAGE})
    chrome.browserAction.setTitle({title: "clipboard sync ON"})
    set(KEY, true);
  }
}

chrome.browserAction.onClicked.addListener(toggleState)
get(KEY).then((result) => toggleState(result));


/**
 * 一定時間毎にクリップボードの内容を送る
 */
let isEnable = true;
// 利用可否の初期値取得
get(KEY).then(result => isEnable = result);
// 利用可否の変更を監視
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (KEY in changes) {
    isEnable = changes[KEY].newValue;
  }
});


const textarea = document.body.appendChild(document.createElement('textarea'));

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

window.setInterval(() => {
  if (!isEnable) return;
  const str = paste();
  if (!str) return;

  sendCopiedText(str);
}, 500);

