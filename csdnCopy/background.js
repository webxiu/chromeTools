// 后台脚本
console.log("chrome.runtime", chrome.runtime);
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
});

let scriptExecuted = false;

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";
  await chrome.action.setBadgeText({ tabId: tab.id, text: nextState });
  console.log("prevState", prevState);

  if (nextState === "ON") {
    if (!scriptExecuted) {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ["page.js"],
      });
      scriptExecuted = true;
    }
  }

  await chrome.tabs.sendMessage(tab.id, {
    status: nextState,
  });
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
  console.log("sender", sender);
  chrome.tts.speak(request.text);
  response({ text: "play success" });
});
