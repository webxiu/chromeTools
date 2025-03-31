// page.js
console.log("插件启用:page.js");

let oIns = null;

const onSwitch = (type) => {
  console.log("开关", type);
  if (type === "on" && !oIns) {
    oIns = new CreateEle({ title: "定时监控", footer: "by hailen" });
  }
};

const onSelectionChange = (ev) => {
  // 隐藏
  document.querySelector(".xh_close").addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const boxDom = document.querySelector(".xh_box");
    boxDom.style.display = "none";
  });

  chrome.runtime.sendMessage({ text: selectText }, (res) => {
    console.log(res.selectText);
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.status === "ON") {
    onSwitch("on");
  } else {
    onSwitch("off");
  }
});
