// page.js 

const playFn = () => {
    const text = window.getSelection().toString();
    if (!text) return;
    // 拷贝文本
    document.execCommand('copy')
    chrome.runtime.sendMessage({ text }, (res) => {
        console.log(res.text)
    })
}

chrome.runtime.onMessage.addListener((message) => {
    console.log('message', message);
    if (message.status === 'ON') {
        document.addEventListener('mouseup', playFn)
    } else {
        document.removeEventListener('mouseup', playFn)
    }
})