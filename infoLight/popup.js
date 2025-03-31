
var cache_key = 'cache_key';

function $(selector) {
  return document.querySelector(selector);
}

function getItem() {
  try {
    const data = localStorage.getItem(cache_key);
    return JSON.parse(data || "{}");
  } catch (error) {
    return {};
  }
}

function setItem(data) {
  localStorage.setItem(cache_key, JSON.stringify(data));
  return data;
}

function getDoms() {
  const oneline = $("#oneline"); // 换行
  const oneline2 = $("#oneline2");
  const hidden = $("#hidden"); // 隐藏
  const hidden2 = $("#hidden2");
  const sortable = $("#sortable"); // 排序
  const sortable2 = $("#sortable2");
  const content = $("#content"); // 内容
  return { oneline, oneline2, hidden, hidden2, sortable, sortable2, content }
}
function initData(storedData) {
  const doms = getDoms()
  doms.oneline.checked = storedData.oneline ?? '';
  doms.oneline2.value = storedData.oneline2 ?? '';
  doms.hidden.checked = storedData.hidden ?? '';
  doms.hidden2.value = storedData.hidden2 ?? '';
  doms.sortable.checked = storedData.sortable ?? '';
  doms.sortable2.value = storedData.sortable2 ?? '';
  doms.content.value = storedData.content ?? '';
}

document.addEventListener("DOMContentLoaded", function () {
  const settingDom = document.getElementById("setting");
  const stopDom = document.getElementById("stop");
  const storedData = getItem(cache_key);

  initData(storedData)// 初始化本地数据

  settingDom.addEventListener("click", function () {
    const { oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = getDoms()
    const formData = {
      oneline: oneline.checked,
      oneline2: oneline2.value,
      hidden: hidden.checked,
      hidden2: hidden2.value,
      sortable: sortable.checked,
      sortable2: sortable2.value,
      content: content.value
    };
    setItem(formData);// 更新本地数据

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        action: 'SET_TITLE',
        data: formData,
        tabId: tabs[0].id
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log('popup窗口信息:', response);
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



