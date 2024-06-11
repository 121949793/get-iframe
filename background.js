
console.log(chrome.runtime)
document.addEventListener('DOMContentLoaded', function () {
  console.log('Popup opened');
  // 其他初始化操作
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
  // Return true to indicate you wish to send a response asynchronously
  return true;
});

function getRandomHexColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}  
