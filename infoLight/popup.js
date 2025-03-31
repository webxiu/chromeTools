
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
  const selectType = $("#selectType"); // 换行
  const newLine = $("#newLine"); // 新行
  const oneline = $("#oneline"); // 换行
  const oneline2 = $("#oneline2");
  const hidden = $("#hidden"); // 隐藏
  const hidden2 = $("#hidden2");
  const sortable = $("#sortable"); // 排序
  const sortable2 = $("#sortable2");
  const content = $("#content"); // 内容
  return { selectType, newLine, oneline, oneline2, hidden, hidden2, sortable, sortable2, content }
}



const selectList = [
  { label: "表格配置", value: "table" },
  { label: "编辑详情", value: "edit" },
  { label: "数据字典", value: "dictionary" },
]

const configObj = {
  table: [
    { id: "oneline", value: "oneline2", label: "是否换行", type: "checkbox", placeholder: "请输入字段名 以逗号分开", },
    { id: "hidden", value: "hidden2", label: "是否隐藏", type: "checkbox", placeholder: "请输入字段名 以逗号分开", },
    { id: "sortable", value: "sortable2", label: "是否排序", type: "checkbox", placeholder: "请输入字段名 以逗号分开", },
  ],
  edit: [
    { id: "newLine", value: "newLine2", label: "是否新行", type: "checkbox", placeholder: "请输入字段名 以逗号分开", },
    { id: "hidden", value: "hidden2", label: "是否隐藏", type: "checkbox", placeholder: "请输入字段名 以逗号分开", },
  ],
  dictionary: []
}

function initData() {
  const storedData = getItem(cache_key);
  const doms = getDoms()
  Object.keys(storedData).forEach((key) => {
    const domElement = doms[key];
    if (domElement && !['selectType'].includes(key)) {
      if (['oneline', 'hidden', 'sortable', 'newLine'].includes(key)) {
        domElement.checked = storedData[key] ?? '';
      } else {
        domElement.value = storedData[key] ?? '';
      }
    }
  })
}

document.addEventListener("DOMContentLoaded", function () {
  const wrapDom = document.querySelector(".wrap-box");
  const settingDom = document.getElementById("setting");
  const selectTypeDom = document.querySelector("#selectType");
  const selectHtml = selectList.map((item) => `<option value="${item.value}">${item.label}</option>`).join("");
  selectTypeDom.innerHTML = selectHtml
  function render(ev) {
    const value = ev?.target?.value ?? "table";
    const htmls = configObj[value].map((item) => {
      return `<div class="flex">
          <label for="${item.id}" class="no-wrap">
            ${item.label}<input id="${item.id}" type="${item.type}" />
          </label>
          <textarea
            name="${item.value}"
            id="${item.value}"
            value="#aaaa,#bbbb"
            rows="1"
            class="w-100"
            placeholder="${item.placeholder}"
          ></textarea>
        </div>
       `
    }).join("");
    wrapDom.innerHTML = htmls
    initData()
  }
  render();
  selectTypeDom.addEventListener("change", render)

  settingDom.addEventListener("click", function () {
    const { selectType, newLine, oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = getDoms()
    const formData = {
      selectType: selectType?.value,
      newLine: newLine?.checked,
      oneline: oneline?.checked,
      oneline2: oneline2?.value,
      hidden: hidden?.checked,
      hidden2: hidden2?.value,
      sortable: sortable?.checked,
      sortable2: sortable2?.value,
      content: content?.value
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

});



