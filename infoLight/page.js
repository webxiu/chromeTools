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

// 更新表格columns配置
async function setTableColumns(data) {
  const { oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = data

  const onelineFields = getField(oneline2) // 不换行的字段
  const hiddenFields = getField(hidden2) // 隐藏的字段
  const sortableFields = getField(sortable2) // 排序的字段

  const columns = JSON.parse(content);
  if (!columns.length || !content) {
    return showMessage('数据不能为空', '#f60');
  }

  try {
    var fieldWrap = dom(".designer-member.tree");
    if (fieldWrap) {
      const topWrap = fieldWrap.parentNode.parentNode.parentNode;
      topWrap.id = "autoId";
      const fieldNodes = fieldWrap.querySelectorAll(".tree-node");
      const list = getEle(fieldNodes)
      for (let i = 0; i < list.length; i++) {
        const ele = list[i];
        const prop = ele.querySelector('span:nth-child(3)').innerText.split(' (')[0];
        const item = columns.find(item => item.prop === prop)
        const filterFields = ['id'] // 不修改的字段
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');


        // 获取属性类名
        function getClass(trIndex, tdIndex) {
          const tableClass = '#autoId .datagrid-view2 .datagrid-btable'
          const className = `${tableClass} tr:nth-child(${trIndex}) td:nth-child(${tdIndex}) div`
          return className
        }

        if (!filterFields.includes(prop)) {
          ele.click();
          await sleep(300);
          const rowTitle = dom(getClass(1, 2));
          rowTitle.click();
          const input = rowTitle.querySelector('input')
          if (input && item) {
            input.value = item.label
          }

          // 是否一行显示
          if (onelineFields.includes(prop) || !onelineFields.length) {
            const nowrapDom = dom(getClass(6, 2));
            nowrapDom.click()
            await sleep(301);
            nowrapDom.click()
            const nowrapCheckDom = nowrapDom.querySelector('input[type="checkbox"]');
            nowrapCheckDom.checked = !!oneline;
          }
          // 是否隐藏
          if (hiddenFields?.includes(prop) || !hiddenFields.length) {
            const hiddenDom = dom(getClass(7, 2));
            hiddenDom.click()
            await sleep(301);
            hiddenDom.click()
            const hiddenCheckDom = hiddenDom.querySelector('input[type="checkbox"]');
            hiddenCheckDom.checked = !!hidden;
          }
          // 是否排序
          if (sortableFields?.includes(prop) || !sortableFields?.length) {
            const sortDom = dom(getClass(8, 2));
            sortDom.click()
            await sleep(301);
            sortDom.click()
            const sortCheckDom = sortDom.querySelector('input[type="checkbox"]');
            sortCheckDom.checked = !!sortable;
          }
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
// 更新编辑columns配置
async function setEditColumns(data) {
  const { oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = data
  const onelineFields = getField(oneline2) // 不换行的字段
  const hiddenFields = getField(hidden2) // 隐藏的字段
  const sortableFields = getField(sortable2) // 排序的字段
  const columns = JSON.parse(content);

  if (!columns.length || !content) {
    return showMessage('数据不能为空', '#f60');
  }

  try {
    var fieldWrap = dom(".designer-member.tree");
    if (fieldWrap) {
      const topWrap = fieldWrap.parentNode.parentNode.parentNode;
      topWrap.id = "autoId";
      const fieldNodes = fieldWrap.querySelectorAll(".tree-node");
      const list = getEle(fieldNodes)
      for (let i = 0; i < list.length; i++) {
        const ele = list[i];
        const prop = ele.querySelector('span:nth-child(3)').innerText.split(' (')[0];
        const item = columns.find(item => item.prop === prop)
        const filterFields = ['id'] // 不修改的字段
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');


        // 获取属性类名
        function getClass(trIndex, tdIndex) {
          const tableClass = '#autoId .datagrid-view2 .datagrid-btable'
          const className = `${tableClass} tr:nth-child(${trIndex}) td:nth-child(${tdIndex}) div`
          return className
        }

        if (!filterFields.includes(prop)) {
          ele.click();
          await sleep(300);
          const rowTitle = dom(getClass(1, 2));
          rowTitle.click();
          const input = rowTitle.querySelector('input')
          if (input && item) {
            input.value = item.label
          }

          // 是否一行显示
          if (onelineFields.includes(prop) || !onelineFields.length) {
            const nowrapDom = dom(getClass(6, 2));
            nowrapDom.click()
            await sleep(301);
            nowrapDom.click()
            const nowrapCheckDom = nowrapDom.querySelector('input[type="checkbox"]');
            nowrapCheckDom.checked = !!oneline;
          }
          // 是否隐藏
          if (hiddenFields?.includes(prop) || !hiddenFields.length) {
            const hiddenDom = dom(getClass(7, 2));
            hiddenDom.click()
            await sleep(301);
            hiddenDom.click()
            const hiddenCheckDom = hiddenDom.querySelector('input[type="checkbox"]');
            hiddenCheckDom.checked = !!hidden;
          }
          // 是否排序
          if (sortableFields?.includes(prop) || !sortableFields?.length) {
            const sortDom = dom(getClass(8, 2));
            sortDom.click()
            await sleep(301);
            sortDom.click()
            const sortCheckDom = sortDom.querySelector('input[type="checkbox"]');
            sortCheckDom.checked = !!sortable;
          }
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
// 更新枚举字典columns配置
async function setDictionaryColumns(data) {
  const { oneline, oneline2, hidden, hidden2, sortable, sortable2, content } = data

  const onelineFields = getField(oneline2) // 不换行的字段
  const hiddenFields = getField(hidden2) // 隐藏的字段
  const sortableFields = getField(sortable2) // 排序的字段

  const columns = JSON.parse(content);
  if (!columns.length || !content) {
    return showMessage('数据不能为空', '#f60');
  }

  try {
    var fieldWrap = dom(".designer-member.tree");
    if (fieldWrap) {
      const topWrap = fieldWrap.parentNode.parentNode.parentNode;
      topWrap.id = "autoId";
      const fieldNodes = fieldWrap.querySelectorAll(".tree-node");
      const list = getEle(fieldNodes)
      for (let i = 0; i < list.length; i++) {
        const ele = list[i];
        const prop = ele.querySelector('span:nth-child(3)').innerText.split(' (')[0];
        const item = columns.find(item => item.prop === prop)
        const filterFields = ['id'] // 不修改的字段
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');


        // 获取属性类名
        function getClass(trIndex, tdIndex) {
          const tableClass = '#autoId .datagrid-view2 .datagrid-btable'
          const className = `${tableClass} tr:nth-child(${trIndex}) td:nth-child(${tdIndex}) div`
          return className
        }

        if (!filterFields.includes(prop)) {
          ele.click();
          await sleep(300);
          const rowTitle = dom(getClass(1, 2));
          rowTitle.click();
          const input = rowTitle.querySelector('input')
          if (input && item) {
            input.value = item.label
          }

          // 是否一行显示
          if (onelineFields.includes(prop) || !onelineFields.length) {
            const nowrapDom = dom(getClass(6, 2));
            nowrapDom.click()
            await sleep(301);
            nowrapDom.click()
            const nowrapCheckDom = nowrapDom.querySelector('input[type="checkbox"]');
            nowrapCheckDom.checked = !!oneline;
          }
          // 是否隐藏
          if (hiddenFields?.includes(prop) || !hiddenFields.length) {
            const hiddenDom = dom(getClass(7, 2));
            hiddenDom.click()
            await sleep(301);
            hiddenDom.click()
            const hiddenCheckDom = hiddenDom.querySelector('input[type="checkbox"]');
            hiddenCheckDom.checked = !!hidden;
          }
          // 是否排序
          if (sortableFields?.includes(prop) || !sortableFields?.length) {
            const sortDom = dom(getClass(8, 2));
            sortDom.click()
            await sleep(301);
            sortDom.click()
            const sortCheckDom = sortDom.querySelector('input[type="checkbox"]');
            sortCheckDom.checked = !!sortable;
          }
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



function addMessageListener() {
  // 接收background.js中的数据
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data, tabId } = message || {}
    if (action !== "SET_TITLE") return
    if (data.selectType === 'table') {
      setTableColumns(data);
    }
    if (data.selectType === 'edit') {
      setEditColumns(data);
    }
    if (data.selectType === 'dictionary') {
      setDictionaryColumns(data);
    }
    sendResponse({ success: true });
  });
}

// 确保只调用一次
if (!window.messageListenerAdded) {
  addMessageListener();
  window.messageListenerAdded = true;
}