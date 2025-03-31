console.log("讯光插件启用:page.js");

// 自动更新标题 
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function dom(selector) {
  return document.querySelector(selector);
}
function domAll(selector, node = document) {
  return node.querySelectorAll(selector);
}
function getEle(list) {
  return Array.prototype.slice.call(list);
}
function printAligned(field, text, len = 30) {
  console.log(`${String(field).padEnd(len)}${text}`);
}
function showMessage(msgText, background = '#00f') {
  let msgDom = document.querySelector(".xh_msg");
  if (!msgDom) {
    const box = document.createElement("div");
    box.className = "xh_msg";
    const styles = { position: 'fixed', display: 'none', top: '16%', left: '50%', fontSize: '18px', transform: 'translate(-50%, -18%)', color: '#fff', background, padding: '8px 16px', borderRadius: '6px', zIndex: 1334455, transition: 'none' };
    Object.assign(box.style, styles);// 定义初始样式
    document.body.appendChild(box);
    msgDom = box;
  }
  msgDom.innerHTML = msgText;
  msgDom.style.display = 'block';
  clearTimeout(this.timer);
  this.timer = setTimeout(() => {
    const hideStyle = { transition: 'top 3s', top: '-100%' };
    Object.assign(msgDom.style, hideStyle);
  }, 2000);
}


function getField(str) {
  if (!str) return []
  return str?.split(',').map(m => m.trim())
}

// 自动更新标题
async function setTitle(data) {
  const { oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = data

  const onelineFields = getField(oneline2) // 不换行的字段
  const hiddenFields = getField(hidden2) // 隐藏的字段
  const sortableFields = getField(sortable2) // 排序的字段

  const columns = JSON.parse(content);
  if (!columns.length || !content) {
    return showMessage('数据不能为空', '#f60');
  }

  try {
    var fieldWrap = dom(".designer-member.tree");// 成员列表
    if (fieldWrap) {
      const topWrap = fieldWrap.parentNode.parentNode.parentNode;
      topWrap.id = "autoId";
      const fieldNodes = fieldWrap.querySelectorAll(".tree-node");
      const list = getEle(fieldNodes).slice(0, 5);
      for (let i = 0; i < list.length; i++) {
        const ele = list[i];
        const prop = ele.querySelector('span:nth-child(3)').innerText.split(' (')[0];
        const item = columns.find(item => item.prop === prop)
        const filterFields = ['id'] // 不修改的字段
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');

        // 获取属性类名
        function getClass(trIndex, tdIndex) {
          const propTable = '#autoId .datagrid-view2 .datagrid-btable'
          const className = `${propTable} tr:nth-child(${trIndex}) td:nth-child(${tdIndex}) div`
          return className
        }


        if (!filterFields.includes(prop)) {
          ele.click();
          await sleep(300);
          const rowTitle = dom(getClass(1, 2));
          rowTitle.click();
          const input = rowTitle.querySelector('input')
          if (input && item) input.value = item.label// 修改标题

          // 设置属性
          async function setProperty({ prop, fieldList, isCheck, trIndex, tdIndex }) {
            if (fieldList.includes(prop) || !fieldList.length) {
              const propDom = dom(getClass(trIndex, tdIndex));
              propDom.click()
              await sleep(301);
              propDom.click()
              const checkDom = propDom.querySelector('input[type="checkbox"]');
              checkDom.checked = isCheck;
            }
          }

          // 是否一行显示
          setProperty({ prop, fieldList: onelineFields, isCheck: !!oneline, trIndex: 6, tdIndex: 2 })
          // 是否隐藏
          setProperty({ prop, fieldList: hiddenFields, isCheck: !!hidden, trIndex: 7, tdIndex: 2 })
          // 是否排序
          setProperty({ prop, fieldList: sortableFields, isCheck: !!sortable, trIndex: 8, tdIndex: 2 })

        }
      }
    }
    console.log('执行完毕');
    showMessage('执行完毕');

  } catch (error) {
    console.error('报错:', error);
    return showMessage('数据格式错误', '#f60');
  }
}


// 接收background.js中的数据
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, data, tabId } = message || {}
  if (action !== "SET_TITLE") return
  setTitle(data);
  sendResponse({ success: true });
});

