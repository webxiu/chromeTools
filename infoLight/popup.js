var cache_key = "cache_key";
var cache_status = "cache_status";
var isDisable = false;

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
  const newLine2 = $("#newLine2");
  const hiddenEdit = $("#hiddenEdit"); // 编辑隐藏
  const hiddenEdit2 = $("#hiddenEdit2");

  const oneline = $("#oneline"); // 换行
  const oneline2 = $("#oneline2");
  const hidden = $("#hidden"); // 隐藏
  const hidden2 = $("#hidden2");
  const sortable = $("#sortable"); // 排序
  const sortable2 = $("#sortable2");
  const content = $("#content"); // 内容
  return {
    selectType,
    newLine,
    newLine2,
    hiddenEdit,
    hiddenEdit2,
    oneline,
    oneline2,
    hidden,
    hidden2,
    sortable,
    sortable2,
    content,
  };
}

const selectList = [
  { label: "表格配置", value: "table" },
  { label: "编辑详情", value: "edit" },
  { label: "数据字典", value: "dictionary" },
];

const configObj = {
  table: [
    {
      id: "oneline",
      value: "oneline2",
      label: "一行显示",
      type: "checkbox",
      placeholder: "更新指定字段:以逗号分开, 不填更新所有",
    },
    {
      id: "hidden",
      value: "hidden2",
      label: "是否隐藏",
      type: "checkbox",
      placeholder: "更新指定字段:以逗号分开, 不填更新所有",
    },
    {
      id: "sortable",
      value: "sortable2",
      label: "是否排序",
      type: "checkbox",
      placeholder: "更新指定字段:以逗号分开, 不填更新所有",
    },
  ],
  edit: [
    {
      id: "newLine",
      value: "newLine2",
      label: "是否新行",
      type: "checkbox",
      placeholder: "更新指定字段:以逗号分开, 不填更新所有",
    },
    {
      id: "hiddenEdit",
      value: "hiddenEdit2",
      label: "是否隐藏",
      type: "checkbox",
      placeholder: "更新指定字段:以逗号分开, 不填更新所有",
    },
  ],
  dictionary: [],
};

function setDisable(disable) {
  const startDom = document.getElementById("start");
  isDisable = disable;
  if (disable) {
    startDom.setAttribute("disabled", true);
    localStorage.setItem(cache_status, 'start');
  } else {
    startDom.removeAttribute("disabled");
    localStorage.setItem(cache_status, 'stop');
  }
}


function setLocalStatus() {
  const startDom = document.getElementById("start");
  const localStatus = localStorage.getItem(cache_status);
  if (localStatus == 'start') {
    startDom.setAttribute("disabled", true);
  } else {
    startDom.removeAttribute("disabled");
  }
}

function initData() {
  const storedData = getItem(cache_key);
  const doms = getDoms();
  Object.keys(storedData).forEach((key) => {
    const domElement = doms[key];
    if (domElement && !["selectType"].includes(key)) {
      if (["oneline", "hidden", "sortable", "newLine"].includes(key)) {
        domElement.checked = storedData[key] ?? "";
      } else {
        domElement.value = storedData[key] ?? "";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const wrapDom = document.querySelector(".wrap-box");
  const startDom = document.getElementById("start");
  const stopDom = document.getElementById("stop");
  const selectTypeDom = document.querySelector("#selectType");
  const selectHtml = selectList
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join("");
  selectTypeDom.innerHTML = selectHtml;
  setLocalStatus();

  function render(ev) {
    const value = ev?.target?.value ?? "table";
    const htmls = configObj[value]
      .map((item) => {
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
       `;
      })
      .join("");
    wrapDom.innerHTML = htmls;
    initData();
  }
  render();
  selectTypeDom.addEventListener("change", render);

  startDom.addEventListener("click", function () {
    if (isDisable) return alert("处理中, 请稍后...");
    const {
      selectType,
      newLine,
      newLine2,
      oneline,
      hiddenEdit,
      hiddenEdit2,
      oneline2,
      hidden,
      hidden2,
      sortable,
      sortable2,
      content,
    } = getDoms();
    const formData = {
      selectType: selectType?.value,
      oneline: oneline?.checked,
      oneline2: oneline2?.value,
      hidden: hidden?.checked,
      hidden2: hidden2?.value,
      sortable: sortable?.checked,
      sortable2: sortable2?.value,
      content: content?.value,

      newLine: newLine?.checked,
      newLine2: newLine2?.value,
      hiddenEdit: hiddenEdit?.checked,
      hiddenEdit2: hiddenEdit2?.value,
    };
    setItem(formData); // 更新本地数据 
    setDisable(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "Start_Event", data: formData, tabId: tabs[0].id, }, (response) => {
        console.log("popup开始响应信息:", response);
        setDisable(false);
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
      }
      );
    });
  });
  stopDom.addEventListener("click", function () {
    setDisable(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: 'Stop_Event', data: { message: "stop" }, tabId: tabs[0].id }, (response) => {
        console.log("popup停止响应信息:", response);
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError.message);
      });
    });
  });
});
