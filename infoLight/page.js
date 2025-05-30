console.log("讯光插件启用");

// 全局变量
var oIns = null;

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

// 获取当前枚举tab
function getActiveTab(selector) {
  var allTable = document.querySelectorAll(selector);
  const tableDoms = getEle(allTable);
  const currentTab = tableDoms.find(f => {
    const pDom = f.parentNode.parentNode
    return pDom.style.display === 'block'
  })
  return currentTab
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

// 修改表格与修改列标题及属性
async function setTableColumns(data, callback) {
  // 当切换选择: 重置列表配置或修改配置
  if (data.selectType === 'table') {
    Object.assign(data, { newLine: undefined, hiddenEdit: undefined })
  } else {
    Object.assign(data, { oneline: undefined, hidden: undefined, sortable: undefined })
  }
  const rowPos = {
    oneline: [6, 2],
    hidden: [7, 2],
    sortable: [8, 2],
    newLine: [3, 2],
    hiddenEdit: [5, 2],
  }
  const columns = JSON.parse(data.content || '[]');
  // if (!columns.length) return showMessage('数据不能为空', '#f60');

  try {
    var fieldWrap = dom(".designer-member.tree");
    if (fieldWrap) {
      const topWrap = fieldWrap.parentNode.parentNode.parentNode;
      topWrap.id = "autoId";
      const fieldNodes = fieldWrap.querySelectorAll(".tree-node");
      const list = getEle(fieldNodes);
      for (let i = 0; i < list.length; i++) {
        if (window.isStop) break;
        const ele = list[i];
        const prop = ele.querySelector('span:nth-child(3)').innerText.split(' (')[0];
        const item = columns.find(item => item.prop === prop)
        const filterFields = ['id'] // 不修改的字段列表
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');

        // 获取属性类名
        function getClass(trIndex, tdIndex) {
          const tableClass = '#autoId .datagrid-view2 .datagrid-btable'
          const className = `${tableClass} tr:nth-child(${trIndex}) td:nth-child(${tdIndex}) div`
          return className
        }
        const myList = Object.keys(data); // 获取所有属性 
        for (let i = 0; i < myList.length; i++) {
          if (window.isStop) break;
          const key = myList[i]
          if (typeof data[key] === 'boolean' && !filterFields.includes(prop)) {
            const pos = rowPos[key]
            const fieldStr = data[key + '2']
            const fieldList = getField(fieldStr) // 输入字段列表

            ele.click(); // 点击选择左侧成员
            await sleep(300);
            const rowTitle = dom(getClass(1, 2));
            rowTitle.click(); // 点击标题唤出输入框
            const input = rowTitle.querySelector('input')
            if (input && item) input.value = item.label// 修改标题
            // 指定更新字段: 列表长度判断
            if (fieldList.length) {
              if (fieldList.includes(prop)) {
                const nowrapDom = dom(getClass(pos[0], pos[1]));
                nowrapDom.click()
                await sleep(300);
                nowrapDom.click()
                const nowrapCheckDom = nowrapDom.querySelector('input[type="checkbox"]');
                nowrapCheckDom.checked = !!data[key];
                await sleep(300);
              }
            } else {
              const nowrapDom = dom(getClass(pos[0], pos[1]));
              nowrapDom.click()
              await sleep(300);
              nowrapDom.click()
              const nowrapCheckDom = nowrapDom.querySelector('input[type="checkbox"]');
              nowrapCheckDom.checked = !!data[key];
              await sleep(300);
            }
          }
        };
      }
    }
    callback()
    console.log('执行完毕');
    showMessage('执行完毕');
  } catch (error) {
    console.error('报错:', error);
    return showMessage('数据格式错误', '#f60');
  }
}

// 更新枚举字典标题方法
async function setDataDictionaryTitle(data, callback) {
  const columns = JSON.parse(data.content);
  try {
    var showTab = getActiveTab(".info-table.panel-noscroll");
    if (showTab) {
      const leftDom = showTab.querySelectorAll(".datagrid-view1 .datagrid-btable tr td:nth-child(2)");
      const rightDom = showTab.querySelectorAll(".datagrid-view2 .datagrid-btable tr td:nth-child(1)");
      const leftList = getEle(leftDom);
      const rightList = getEle(rightDom);
      for (let i = 0; i < leftList.length; i++) {
        const lDom = leftList[i];
        const rDom = rightList[i];
        const prop = lDom.innerText
        const item = columns.find(item => item.prop === prop)
        printAligned(`prop: ${prop}`, item?.label || '==========字段不存在');
        if (item && rDom) {
          rDom.click();
          await sleep(500); // 等待一秒 
          const input = rDom.querySelector('input')
          if (input) input.value = item.label
        }
      }
    }
    callback()
    console.log('执行完毕');
    showMessage('执行完毕');

  } catch (error) {
    console.error('报错:', error);
  }
}


function addMessageListener() {
  // 事件监听
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { action, data, tabId } = request || {}
    console.log('消息:', request)
    function sendRes() {
      window.isStop = false
      sendResponse({ success: true });
    }
    // 初始化
    if (action === "Menu_Event") {
      sendRes()
      localStorage.setItem('__Menu_Path', JSON.stringify(data))
    }
    // 开始
    if (action === "Start_Event") {
      window.isStop = false
      if (['table', 'edit'].includes(data.selectType)) {
        setTableColumns(data, sendRes);
      } else if (data.selectType === 'dictionary') {
        setDataDictionaryTitle(data, sendRes);
      } else {
        sendRes()
      }
    }
    // 停止
    if (action === "Stop_Event") {
      window.isStop = true
    }
    return true
  });
}

// 确保只调用一次
if (!window.messageListenerAdded) {
  addMessageListener();
  window.messageListenerAdded = true;
  window.isStop = false
}

window.onload = function () {
  const treeMenu = document.querySelector('#layoutMainWest #treeMenu');
  if (!treeMenu) return
  const menuPathObj = JSON.parse(localStorage.getItem('__Menu_Path') || '{}');

  // ============================= 记录点击菜单 =============================
  // 监听treeMenu的点击事件（事件委托）
  treeMenu.addEventListener('click', function (e) {
    if (!menuPathObj.menuPath) {
      return
    }
    const isHumanClick = e.isTrusted; // true=人为触发，false=脚本触发
    const treeNode = e.target.closest('.tree-node');
    if (treeNode) {
      const title = treeNode.querySelector('.tree-title').textContent;
      const path = [title];
      let parentLi = treeNode.closest('ul')?.closest('li');
      while (parentLi) {
        const parentTitle = parentLi.querySelector('.tree-title')?.textContent;
        if (parentTitle) {
          path.unshift(parentTitle);
        }
        parentLi = parentLi.closest('ul')?.closest('li');
      }
      if (isHumanClick) {
        localStorage.setItem('__menu_path', JSON.stringify(path));
      }
    }
  });
  // ============================= 按菜单点击回显 =============================

  function expandTreePath(path, delay = 800) {
    let index = 0;
    function next() {
      if (index >= path.length) return;

      const titleText = path[index];

      // 找到所有 .tree-title 中文本匹配的元素
      const titleElements = Array.from(document.querySelectorAll('.tree-title'))
        .filter(el => el.textContent.trim() === titleText);

      if (titleElements.length === 0) {
        // console.warn(`未找到标题为 "${titleText}" 的节点`);
        index++;
        setTimeout(next, delay);
        return;
      }

      const titleEl = titleElements[0];
      const nodeEl = titleEl.closest('div.tree-node') || titleEl.parentElement.closest('div.tree-node');

      if (!nodeEl) {
        // console.warn(`找不到 ${titleText} 的父 div.tree-node 节点`);
        index++;
        setTimeout(next, delay);
        return;
      }

      const hitEl = nodeEl.querySelector('.tree-hit');
      const iconEl = nodeEl.querySelector('.tree-icon');

      // 如果没有展开按钮或图标，则直接点击该节点
      if (!hitEl || !iconEl) {
        // console.log(`${titleText} 没有展开按钮或图标，尝试点击节点本身`);
        nodeEl.click();
        index++;
        setTimeout(next, delay);
        return;
      }

      // 如果是叶子节点，跳过
      if (iconEl.classList.contains('tree-file')) {
        // console.log(`${titleText} 是叶子节点，无需展开`);
        index++;
        setTimeout(next, delay);
        return;
      }

      // 如果已经是展开状态，跳过
      if (hitEl.classList.contains('tree-expanded')) {
        // console.log(`${titleText} 已展开`);
        index++;
        setTimeout(next, delay);
        return;
      }

      // 点击展开按钮来展开节点
      hitEl.click();
      // console.log(`正在展开：${titleText}`); 
      index++;
      setTimeout(next, delay); // 等待子级加载后再继续
    }
    next();
  }
  const savedPath = JSON.parse(localStorage.getItem('__menu_path') || '[]');
  // console.log(`菜单路径:`, savedPath)
  if (savedPath?.length > 0 && menuPathObj.menuPath) {
    const time = `${menuPathObj.menuPath2 || 1000}`;
    expandTreePath(savedPath, +time);
  }
}
