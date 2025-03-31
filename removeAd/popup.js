document.addEventListener("DOMContentLoaded", function () {
  const settingDom = document.getElementById("setting");
  const stopDom = document.getElementById("stop");
  const textarea = document.getElementById("content");
  const storedData = localStorage.getItem('myTextareaData');
  if (storedData) {
    textarea.value = storedData;
  }

  // 监听 textarea 的输入事件
  textarea.addEventListener('input', () => {
    localStorage.setItem('myTextareaData', textarea.value);
  });

  settingDom.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: 'buttonClicked',
        data: textarea.value,
        tabId: tabs[0].id
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log('Message sent successfully:', response);
        }
      });
    });
  });

  stopDom.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: 'stop_event',
        data: '停止',
        tabId: tabs[0].id
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log('Message sent successfully:', response);
        }
      });
    });
  });
});



