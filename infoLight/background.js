console.log("background后台:", chrome.runtime);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { tabId } = request;
  console.log('接收信息', request)
  chrome.scripting.executeScript({ target: { tabId }, files: ['page.js'] }, () => {
    chrome.tabs.sendMessage(tabId, request, sendResponse);
  });
  return true; // 保持消息通道打开，直到 sendResponse 被调用

});