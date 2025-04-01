console.log("background后台:", chrome.runtime);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('接收信息', message)
  if (message.action === 'Start_Event') {
    const { data, tabId } = message;
    chrome.scripting.executeScript({ target: { tabId }, files: ['page.js'] }, () => {
      chrome.tabs.sendMessage(tabId, { action: 'Start_Event', tabId, data }, sendResponse);
    });
    return true; // 保持消息通道打开，直到 sendResponse 被调用
  }
  if (message.action === 'Stop_Event') {
    const { data, tabId } = message;
    chrome.scripting.executeScript({ target: { tabId }, files: ['page.js'] }, () => {
      chrome.tabs.sendMessage(tabId, { action: 'Stop_Event', tabId, data }, sendResponse);
    });
    return true;
  }
});