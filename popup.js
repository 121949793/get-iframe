let getIfmBtn = document.querySelector(".getIfm")
let color = document.querySelector('.color')
getIfmBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    console.log("bg收到响应回传的response：", response)
    color.innerHTML = `<a id="iframeHanlder">${response.iframe}</a>`
    document.querySelector('#iframeHanlder').addEventListener('click', (event) => {
      event.preventDefault()
      copyText(event)
    })
  });
});
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

  // 选择文本框中的文本
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // 对移动设备的兼容性

  // 执行复制命令
  document.execCommand("copy");

  // 移除临时的输入框
  document.body.removeChild(tempInput);

  // 可选：显示复制成功的提示
  alert("文本已复制: " + copyText);
}