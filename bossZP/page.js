!(function (window) {
    "use strict";
    // boss直聘 移出不在线和 待遇低于max的招聘
    function getOnLine(max = 12) {
        var msgDom = document.querySelector('.xh_msg');
        var lists = document.querySelectorAll('#wrap > div.page-job-wrapper > div.page-job-inner > div > div.job-list-wrapper > div.search-job-result > ul > li');
        var len = lists.length;
        var count = 0;
        if (!len) {
            console.log('没有可显示的列表')
            return;
        };
        if (!msgDom) {
            var box = document.createElement('div');
            box.className = 'xh_msg';
            box.style.cssText = `z-index: 334455;position: fixed;display: none;top: 17%;left: 50%;transform: translate(-50%, -18%);background: rgb(0 255 14);border-radius: 4px;transition: top 2s;padding: 10px 20px;text-align: center;font-size: 16px;box-shadow: 0 0 3px #9e9aff;color: #006fff;`;
            document.body.appendChild(box);

            var observer = new IntersectionObserver((mutaions) => {
                if (!mutaions[0].isIntersecting) {
                    msgDom.style.display = 'none';
                }
            });
            observer.observe(box);
            msgDom = box;
        }
        lists.forEach((item, i) => {
            var online = item.querySelector('.boss-online-tag');
            var salary = item.querySelector('.salary').innerHTML;
            var apply = item.querySelector('.start-chat-btn')?.innerHTML;
            var jobName = item.querySelector('.job-name').innerHTML;
            var otherPlace = item.querySelector('.job-name-icon')?.innerHTML;
            var money = salary.match(/\d+/g).map(item => Number(item));
            var maxMoney = Math.max(...money);
            var jobs = ['前端', '开发', '兼职'].some(item => jobName.indexOf(item) > -1)

            if (otherPlace || !jobs || !online || maxMoney < max || apply === '继续沟通') {
                ++count;
                console.log('不合格:', apply.padEnd(6, ' '), `${maxMoney}`.padEnd(4, ' '), `外地:${otherPlace}`, jobName)
                item.parentNode.removeChild(item);
            }
        });

        var msgTip = `共${len}条, 不在线/沟通过/${max}k以下的已删除${count}条, 剩余${len - count}条`;
        msgDom.style.top = '17%';
        msgDom.style.display = 'block';
        msgDom.innerHTML = msgTip;
        console.log(msgTip);

        var timer = setTimeout(() => {
            msgDom.style.top = '-100%';
            clearTimeout(timer);
        }, 5000);
    };
    // 前程无忧 移出不在线和 待遇低于max的招聘, 5天内
    function get51Job(max = 12, days = 5) {
        var msgDom = document.querySelector('.xh_msg');
        var lists = document.querySelectorAll('.j_joblist .e');
        var len = lists.length;
        var count = 0;
        if (!len) {
            console.log('没有可显示的列表:', hostname)
            return;
        };
        if (!msgDom) {
            var box = document.createElement('div');
            box.className = 'xh_msg';
            box.style.cssText = `z-index: 334455;position: fixed;display: none;top: 17%;left: 50%;transform: translate(-50%, -18%);background: rgb(0 255 14);border-radius: 4px;transition: top 2s;padding: 10px 20px;text-align: center;font-size: 16px;box-shadow: 0 0 3px #9e9aff;color: #006fff;`;
            document.body.appendChild(box);

            var observer = new IntersectionObserver((mutaions) => {
                if (!mutaions[0].isIntersecting) {
                    msgDom.style.display = 'none';
                }
            });
            observer.observe(box);
            msgDom = box;
        }

        function isDate(month, day, validTime) {// 有效期多少天
            const date = new Date();
            const year = date.getFullYear();
            const _month = date.getMonth() + 1;
            const _day = date.getDate();
            const timeDis = new Date(year, _month, _day).getTime() - new Date(year, month, day).getTime();
            const setDay = validTime * 24 * 60 * 60 * 1000
            return timeDis > setDay ? false : true;
        };

        lists.forEach((item, i) => {
            var moneystr = item.querySelector('.sal').innerHTML;
            var dateStr = item.querySelector('.time').innerHTML;
            var apply = item.querySelector('.p_but').innerHTML.trim();
            var jname = item.querySelector('.jname').innerHTML.trim();
            var datetime = dateStr.match(/\d+/g).map(item => Number(item));
            // var money = moneystr.split('·')[0].split('-').map(item => Number(item.replace(/[^\d.-]/g, '').replace('.', '')));
            // var maxMoney = Math.max(...money);
            var isvalid = isDate(datetime[0], datetime[1], days);
            var jobs = ['前端', '开发', '兼职'].some(item => jname.indexOf(item) > -1)


            if (!jobs || !isvalid || apply === '已申请') {//|| maxMoney < max  
                console.log('不合格:', dateStr, apply.padEnd(6, ' '), jname.padEnd(12, ' '), moneystr.padEnd(12, ' '),)

                ++count;
                item.parentNode.removeChild(item);
            }
        });

        var msgTip = `共${len}条, 已经申请/大于${days}天的已删除${count}条, 剩余${len - count}条`;
        msgDom.style.top = '17%';
        msgDom.style.display = 'block';
        msgDom.innerHTML = msgTip;
        console.log(msgTip);

        var timer = setTimeout(() => {
            msgDom.style.top = '-100%';
            clearTimeout(timer);
        }, 5000);
    };


    //事件方法
    const eventHandler = (e) => {
        chrome.runtime.sendMessage({ data: e }, function (res) {
            console.log('res', res);
            const hostname = window.location.hostname;
            const boss = hostname.indexOf("zhipin.com") > -1
            const job = hostname.indexOf("51job.com") > -1
            if (boss || job) {
                setTimeout(() => {
                    boss ? getOnLine() : get51Job();
                }, 1000);
                console.log('支持:', hostname);
            } else {
                console.log('当前网站不支持:', hostname)
            }
        });
    }


    chrome.runtime.onMessage.addListener((message) => {
        console.log('boss:', message);
        if (message.status === 'ON') {
            document.addEventListener('mouseup', eventHandler)
        } else {
            document.removeEventListener('mouseup', eventHandler)
        }
    })


})(window);
