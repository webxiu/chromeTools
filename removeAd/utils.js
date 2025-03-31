

class CreateEle {
  boxDom = null;
  flag = false;
  startX = 0;
  startY = 0;
  options = {};
  timer = null;
  constructor(options) {
    this.options = options;
    this.init();
  }

  init() {
    const selectorList = ['#s_new_search_guide']
    this.boxDom = document.createElement("div");
    this.boxDom.className = "xh_box";
    this.boxDom.innerHTML = `
        <div class="header">${this.options.title}</div>
        <div class="body"> 
        <form>
            <div class="form-item">
                <label for="compare">比较方式:</label> 
                <select name="compare" id="compare"  placeholder="请选择"> 
                    <option value="greater">大于</option>
                    <option value="less">小于</option>
                    <option value="equal ">等于</option> 
                </select>
            </div> 
            <div class="form-item">
               ${selectorList.map(item => {
      return `选择器: ` + item
    })}
            </div>
            <div class="form-item align-center"> 
                <button class="start">开始</button>&nbsp;&nbsp;
                <button class="stop">暂停</button>
            </div> 
            </form>
        </div>
        <div class="footer">${this.options.footer}</div>
    `;
    document.body.appendChild(this.boxDom);
    const dragDom = this.boxDom?.querySelector(".header");
    dragDom?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { offsetX, offsetY } = e;
      this.startX = offsetX;
      this.startY = offsetY;
      this.flag = true;
    });
    document?.addEventListener("mousemove", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.flag) return;
      let x = e.clientX - this.startX;
      let y = e.clientY - this.startY;
      // 限制元素在指定区域内移动
      const maxWidth = window.innerWidth - this.boxDom.offsetWidth;
      const maxHeight = window.innerHeight - this.boxDom.offsetHeight;
      const newLeft = Math.max(0, Math.min(x, maxWidth));
      const newTop = Math.max(0, Math.min(y, maxHeight));
      this.boxDom.style.left = newLeft + "px";
      this.boxDom.style.top = newTop + "px";
    });
    document.addEventListener("mouseup", () => (this.flag = false));

    // 事件
    $(".start").addEventListener("click", this.onStart);
    $(".stop").addEventListener("click", this.onStop);


    selectorList.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element) element.remove();
      });
    })
  }

  onStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const element = $("#element").value;
    const compare = $("#compare").value;
    const result = $("#result").value;

    location.reload(); // 重新加载当前页面

    setDataInfo({ element, compare, result });
  };

  onStop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = getDataInfo();
    console.log("111", res);

    clearInterval(this.timer);
  };

  abserve = () => {
    if (this.boxDom) {
      var observer = new IntersectionObserver((mutaions) => {
        if (!mutaions[0].isIntersecting) {
          this.boxDom.style.display = "none";
        }
      });
      observer.observe(this.boxDom);
    } else {
      observer.unobserve(this.boxDom);
    }
  };

  sendMesg = () => {
    // 发送消息到谷歌
    //   chrome.runtime.sendMessage({ text: "666" }, (res) => {
    //     console.log(res.text);
    //   });
  };
}
// const el = new CreateEle({ title: '森林', footer: '砖墙' })