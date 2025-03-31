console.log("后台 chrome.runtime", chrome.runtime);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('接收信息', message)

  if (message.action === 'buttonClicked') {
    const { data, tabId } = message;
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['page.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: 'buttonClicked', tabId, data }, sendResponse);
    });

    return true; // 保持消息通道打开，直到 sendResponse 被调用
  }
  if (message.action === 'stop_event') {
    const { data, tabId } = message;
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['page.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: 'stop_event', tabId, data }, sendResponse);
    });

    return true; // 保持消息通道打开，直到 sendResponse 被调用
  }
});