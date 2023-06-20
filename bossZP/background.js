// 后台脚本 
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: 'OFF' })
})

let scriptExecuted = false;

chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'
    await chrome.action.setBadgeText({ tabId: tab.id, text: nextState })

    if (nextState === "ON") {
        if (!scriptExecuted) {
            await chrome.scripting.executeScript({
                target: {
                    tabId: tab.id
                },
                files: ['page.js']
            })
            scriptExecuted = true;
        }
    }

    await chrome.tabs.sendMessage(tab.id, {
        status: nextState
    })
});


chrome.runtime.onMessage.addListener((request, sender, response) => {
    console.log('后台接收数据:', request, sender)
    response({ bg: '返回给你' })
})