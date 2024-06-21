chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(request, 123123)
  if (request.action == 'currentIframe') {
    sendMsg(request.info)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  sendMsg()

});
let getIfmBtn = document.querySelector(".getIfm")
// getIfmBtn.addEventListener('click', () => {
//   sendMsg()
// });
console.log(document)


function sendMsg(id) {
  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    // console.log("bg收到响应回传的response：", response)
    let obj = response.iframe
    // appendHtml(response.iframe)
    const firstKey = Object.keys(obj)[0];
    let target = id ? id : firstKey
    console.log(obj, target)
    const firstValue = obj[target];
    appendHtml(firstValue)
  });
}


function copyText(element) {
  if (element == 'undefined') {
    element = ''
  }
  // 获取 <a> 标签中的文本
  var copyText = element;
  // 创建一个临时的输入框元素
  var tempInput = document.createElement("input");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px";
  tempInput.value = copyText;
  document.body.appendChild(tempInput);

  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);


  chrome.runtime.sendMessage({ action: 'copyDone', info: element })
  // 可选：显示复制成功的提示
  // alert("文本已复制: " + copyText);
}

function splitUrl(url) {
  let str = String(url).split('?')[0]
  return str
}

function appendHtml(totalIF) {
  console.log(totalIF)
  let color = document.querySelector('.color')
  let str = ''
  for (const key in totalIF) {
    let domName = `iframeHanlder${key}`
    let item = totalIF[key]
    str += `<button id="${domName}" data-src="${item.path}"  class="btn-flat">${item.name}</button>`
  }
  color.innerHTML = str
  for (const key in totalIF) {
    let domName = `iframeHanlder${key}`
    mountFun(`#${domName}`)
  }
}

function mountFun(dom) {

  document.querySelector(dom).addEventListener('click', (event) => {
    event.preventDefault()
    copyText(event.target.dataset.src)
  })
}