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

