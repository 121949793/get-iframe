document.addEventListener('DOMContentLoaded', function () {
  sendMsg()
});
let getIfmBtn = document.querySelector(".getIfm")
getIfmBtn.addEventListener('click', () => {
  sendMsg()
});

function sendMsg() {
  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    console.log("bg收到响应回传的response：", response)
    appendHtml(response.iframe)
  });
}


function copyText(element) {
  // 获取 <a> 标签中的文本
  var copyText = element.target.textContent;
  console.dir(element)
  // 创建一个临时的输入框元素
  var tempInput = document.createElement("input");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px";
  tempInput.value = copyText;
  document.body.appendChild(tempInput);

  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  // 可选：显示复制成功的提示
  alert("文本已复制: " + copyText);
}

function splitUrl(url) {
  let str = String(url).split('?')[0]
  return str
}

function appendHtml(totalIF) {
  let color = document.querySelector('.color')
  let str = ''
  totalIF.forEach((item, index) => {
    let domName = `iframeHanlder${index}`
    str += `<a id="${domName}">${splitUrl(item)}</a><br>`
  });
  color.innerHTML = str
  totalIF.forEach((item, index) => {
    let domName = `iframeHanlder${index}`
    mountFun(`#${domName}`)
  });
}

function mountFun(dom) {
  document.querySelector(dom).addEventListener('click', (event) => {
    event.preventDefault()
    copyText(event)
  })
}