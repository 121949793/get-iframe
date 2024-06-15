// 创建上下文菜单项
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "点击我！",
    contexts: ["all"]
  });
});

// 监听上下文菜单项点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sampleContextMenu") {
    console.log(chrome.notifications)
    chrome.notifications.create({
      type: "basic",
      iconUrl: './images/icon.png',
      title: "通知",
      message: "你点击了上下文菜单项！"
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    console.log("Message received from popup.js:", request);
    // 处理逻辑并响应popup
    // 向content script发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs, 111111111111)
      chrome.tabs.sendMessage(tabs[0].id, { action: "highlightText", color: getRandomHexColor() }, (response) => {
        // const data = { message: "Hello from background.js!" };
        sendResponse(response);
      });
    });
  }
  console.log(request)
});

function getRandomHexColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}  
