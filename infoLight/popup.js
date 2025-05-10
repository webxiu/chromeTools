var cache_key = "cache_key";
var cache_status = "cache_status";
var isDisable = false;
var initObj = {
  oneline: false,
  hidden: false,
  sortable: false,
  newLine: false,
  hiddenEdit: false,
  oneline2: '',
  hidden2: '',
  sortable2: '',
  newLine2: '',
  hiddenEdit2: '',
  content: '',
  selectType: '',
  menuPath: false,
  menuPath2: '1000',
}

function $(selector) {
  return document.querySelector(selector);
}

function getItem() {
  try {
    const data = localStorage.getItem(cache_key);
    const dataObj = JSON.parse(data || "{}");
    return { ...initObj, ...dataObj }
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
  const menuPath = $("#menuPath"); // 菜单记录
  const menuPath2 = $("#menuPath2");
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
    menuPath,
    menuPath2,
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

const commonList = [
  {
    id: "menuPath",
    value: "menuPath2",
    label: "展开菜单",
    type: "checkbox",
    placeholder: "展开时间间隔默认1000, 单位毫秒",
  },
]


// 发送消息到后台
function _sendMessage(data, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
      console.log("popup响应信息:", data.action, response);
      if (typeof callback === 'function') callback(response);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      console.log("Received response:", response);
    });
  });
}

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
    if (!domElement || ["selectType"].includes(key)) return;
    if (["menuPath2"].includes(key)) {
      domElement.value = storedData[key] ?? initObj.menuPath2;
    } else if (["menuPath", "oneline", "hidden", "sortable", "newLine", "hiddenEdit"].includes(key)) {
      domElement.checked = storedData[key] ?? false;
    } else {
      domElement.value = storedData[key] ?? "";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const wrapDom = document.querySelector(".wrap-box");
  const startDom = document.getElementById("start");
  const stopDom = document.getElementById("stop");
  const clearDom = document.getElementById("clear");
  const menuDom = document.getElementById("menu");
  const selectTypeDom = document.querySelector("#selectType");

  const selectHtml = selectList
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join("");
  selectTypeDom.innerHTML = selectHtml;
  setLocalStatus();

  function render(ev) {
    const value = ev?.target?.value ?? "table";
    const htmls = [...configObj[value], ...commonList]
      .map((item) => {
        return `<div class="flex">
          <label for="${item.id}" class="no-wrap">
            ${item.label}<input id="${item.id}" type="${item.type}" />
          </label>
          <textarea
            name="${item.value}"
            id="${item.value}"
            value=""
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



  function setLocalCache() {
    const { selectType, newLine, newLine2, oneline, hiddenEdit, hiddenEdit2, oneline2, hidden, hidden2, sortable, sortable2, content, menuPath, menuPath2 } = getDoms();
    const formData = {
      oneline: oneline?.checked, // 选项
      hidden: hidden?.checked,
      sortable: sortable?.checked,
      newLine: newLine?.checked,
      hiddenEdit: hiddenEdit?.checked,

      oneline2: oneline2?.value, // 输入项
      hidden2: hidden2?.value,
      sortable2: sortable2?.value,
      newLine2: newLine2?.value,
      hiddenEdit2: hiddenEdit2?.value,

      content: content?.value,
      selectType: selectType?.value,

      menuPath: menuPath?.checked,
      menuPath2: menuPath2?.value,
    };
    setItem(formData); // 更新本地数据 
  }


  startDom.addEventListener("click", function () {
    if (isDisable) return alert("处理中, 请稍后...");
    setLocalCache()
    setDisable(true);

    _sendMessage({ action: "Start_Event", data: formData, }, (response) => {
      setDisable(false);
    })
  });
  stopDom.addEventListener("click", function () {
    setDisable(false);
    _sendMessage({ action: "Stop_Event", data: { message: "stop" }, })
  });
  clearDom.addEventListener("click", function () {
    localStorage.removeItem(cache_key);
    localStorage.removeItem(cache_status);
    const doms = getDoms();
    Object.keys(doms).forEach((key) => {
      const dom = doms[key];
      if (!doms[key] || ["selectType"].includes(key)) return;
      if (["menuPath2"].includes(key)) {
        dom.value = initObj.menuPath2;
      } else if (["oneline", "hidden", "sortable", "newLine", "hiddenEdit"].includes(key)) {
        dom.checked = false;
      } else {
        dom.value = '';
      }
    });
    _sendMessage({ action: "Menu_Event", data: initObj });
  });

  menuDom.addEventListener("click", function () {
    const { menuPath, menuPath2 } = getDoms();
    setLocalCache()
    _sendMessage({ action: "Menu_Event", data: { menuPath: menuPath.checked, menuPath2: menuPath2.value } });
  });
});


