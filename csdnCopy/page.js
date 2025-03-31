// page.js
console.log("插件启用:page.js");
const onSwitch = (type) => {
  console.log("开关", type);
  const all = document.querySelectorAll("*");
  const pres = document.querySelectorAll("pre");
  const codes = document.querySelectorAll("pre code");
  [...all, ...pres, ...codes].forEach((item) => {
    item.style.userSelect = "text";
  });

  // 发送消息到谷歌
  //   chrome.runtime.sendMessage({ text: "666" }, (res) => {
  //     console.log(res.text);
  //   });
};
let timer = null;
let selectText = null;
let flag = false;
const onSelectionChange = (ev) => {
  selectText = document.getSelection().toString();
  console.log("======>鼠标事件:\n", selectText);

  document.addEventListener("mouseup", (ev) => {
    const { clientX, clientY } = ev;
    let boxDom = document.querySelector(".xh_box");
    let contentDom = document.querySelector(".xh_cont");

    if (!boxDom) {
      boxDom = document.createElement("div");
      contentDom = document.createElement("textarea");
      const spanDom = document.createElement("span");
      boxDom.className = "xh_box";
      contentDom.className = "xh_cont";
      spanDom.className = "xh_close";

      spanDom.innerHTML = "x";
      spanDom.style.cssText = ` 
        position: absolute;
        top: 2px;
        right: 2px;
        width: 15px;
        height: 15px;
        display: inline-block;
        background: #dfdfdf;
        color: #f60;
        line-height: 15px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
      `;

      boxDom.style.cssText = `
        position: fixed;
        top: ${clientY}px;
        left: ${clientX}px;
        width: 300px;
        background: rgba(34, 34, 63, 0.8);
        border-radius: 8px;
        padding: 10px;
        color: rgb(255, 255, 255);
        display: block;
        z-index: 999999;
        border: 1px solid #535353;
      `;
      contentDom.style.cssText = `
        min-height: 120px;
        background-color: rgba(61, 61, 61, 0.4);
        width: 100%;
        border: 1px solid #7b7b7b61;
        padding: 5px;
        color: #acb5c5;
      }
      `;
      contentDom.setAttribute("rows", 5);

      boxDom.appendChild(spanDom);
      boxDom.appendChild(contentDom);
      document.body.appendChild(boxDom);
    }
    if (selectText) {
      boxDom.style.display = "block";
      boxDom.style.top = `${clientY}px`;
      boxDom.style.left = `${clientX}px`;
      contentDom.value = selectText + "\n\n";
    }
    contentDom.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      return;
    });

    // boxDom.addEventListener("mousedown", (e) => {
    //   flag = true;
    //   e.stopPropagation();
    //   e.preventDefault();
    //   document.addEventListener("mousemove", (e) => {
    //     if (flag) {
    //       const { clientX, clientY } = e;
    //       boxDom.style.top = clientY + "px";
    //       boxDom.style.left = clientX + "px";
    //     }
    //   });
    // });
    // if (flag) flag = false;
  });

  // 隐藏
  document.querySelector(".xh_close").addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const boxDom = document.querySelector(".xh_box");
    boxDom.style.display = "none";
    selectText = null;
  });

  chrome.runtime.sendMessage({ text: selectText }, (res) => {
    console.log(res.selectText);
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.status === "ON") {
    onSwitch("on");
    document.addEventListener("selectionchange", onSelectionChange);
  } else {
    onSwitch("off");
    document.removeEventListener("selectionchange", onSelectionChange);
  }
});
