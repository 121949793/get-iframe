let getIfmBtn = document.querySelector(".getIfm")
let color = document.querySelector('.color')
getIfmBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
    console.log("bg收到响应回传的response：", response)
    color.innerHTML = `<a href='response.iframe'>${response.iframe}</a>`
  });
});