console.log("移除广告插件启用:page.js");
var Ad_Cache = "Ad_Cache";
window.timerObj = {};

/** 保存本地 */
function getData(key = Ad_Cache) {
  return localStorage.getItem(key);
}
function setData(userInfo, key = Ad_Cache) {
  localStorage.setItem(key, userInfo);
}

function onRemoveElement(data) {
  const selectorList = (data || getData()).split(",").map((s) => s.trim());
  // console.log("选择器:", selectorList);
  selectorList?.forEach((selector) => {
    try {
      [...document.querySelectorAll(selector)].forEach(element => {
        if (element) element.remove();
      });
    } catch (error) {
      console.error(error);
    }
  });
}

function onStart(message) {
  const { action, data, tabId } = message || {}
  if (action === "stop_event") {
    clearInterval(window.timerObj[tabId]);
  } else {
    window.timerObj[tabId] = setInterval(() => {
      onRemoveElement(data);
    }, 2000);
  }

}




console.log("状态", getData("Run_Status"));

if (getData("Run_Status") === "start") onStart();



// 接收background.js中的数据
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message', message)
  const isStart = message.action === "buttonClicked"
  if (message.action === "buttonClicked") {
    setData(message.data); // 保存
  }
  onStart(message); // 启动
  setData(isStart ? "start" : "stop", "Run_Status");
  sendResponse({ success: true });
});

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.status === "ON") {
//     onSwitch("on");
//   } else {
//     onSwitch("off");
//   }
// });
