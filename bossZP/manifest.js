var aa = {
   "background": {
      "scripts": ["lib/sea.js", "bg.js"]
   },
   "browser_action": {
      "default_icon": "icons/icon.png",
      "default_popup": "popup.html",
      "default_title": "zh_CN"
   },
   "content_scripts": [{
      "all_frames": false,
      "js": ["straightGoogle.js"],
      "matches": ["http://*/*", "https://*/*"],
      "run_at": "document_end"
   }],
   "content_security_policy": "script-src 'self' 'unsafe-eval' https://ssl.google-analytics.com; object-src 'self'",
   "default_locale": "zh_CN",
   "description": "最简单易用的谷歌访问助手,为chrome扩展用户量身打造。可以解决chrome扩展无法自动更新的问题，同时可以访问谷歌google搜索，gmail邮箱，google+等谷歌服务。",
   "icons": {
      "128": "icons/icon-128.png",
      "16": "icons/icon.png"
   },
   "manifest_version": 2,
   "minimum_chrome_version": "18.0.0",
   "name": "谷歌访问助手破解版",
   "options_page": "options.html",
   "permissions": ["proxy", "tabs", "contextMenus", "webRequest", "webRequestBlocking", "webNavigation", "unlimitedStorage", "notifications", "\u003Call_urls>", "http://*/*", "https://*/*", "ftp://*/*"],
   "version": "2.3.0",
   "web_accessible_resources": ["first.html"]
}
