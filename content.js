chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    document.body.style.backgroundColor = request.color;

    let getAllIframe = getArrIfm()
    // let totalFun = getIfmFuns(getAllIframe)
    // let allIframeHTML = getAllIframeHTML(getAllIframe)
    // let iframeFunURL = getIframeFunUrl(allIframeHTML, totalFun)
    console.log(getAllIframe)
    sendResponse({ iframe: getIframeSrc(getAllIframe) });
  }
});

function getArrIfm() {
  let getAllIframe = document.querySelectorAll('iframe')
  let [item, ...arg] = getAllIframe
  return getAllIframe
}

function getIframeDom(iframe) {
  let iframeDocument = iframe.contentWindow.document;
  let DOM = iframeDocument.documentElement;
  let scripts = DOM.getElementsByTagName('script')

  for (var i = 0; i < scripts.length; i++) {
    var scriptContent = scripts[i].textContent || scripts[i].innerText; // 兼容性处理  
    // console.log('Script ' + (i + 1) + ':');
    // console.log(scriptContent);
    // console.dir(scripts[i])
    // console.log('------------------------');
  }
  return DOM
}

function getIframeDomHTML(iframe) {
  let iframeDocument = iframe.contentWindow.document;
  let DOM = iframeDocument.documentElement.outerHTML;
  return DOM
}

function getAllIframeHTML(allIfm) {
  let totalFun = []
  allIfm.forEach(item => {
    let ifDom = getIframeDomHTML(item)
    totalFun.push(ifDom)
  })
  return totalFun
}
function getIfmFuns(allIfm) {
  let totalFun = []
  allIfm.forEach(item => {
    let ifDom = getIframeDom(item)
    let bars = ifDom.querySelector('#toolsOther')?.querySelectorAll('a')
    bars = [...bars]
    funArr = bars.map(node => node.attributes['onclick'].nodeValue)
    totalFun.push(funArr)
  })
  return totalFun
}

function getIframeFunUrl(iframeArr, funArr) {
  if (iframeArr.length == 0 || funArr.length == 0) return
  if (iframeArr.length != funArr.length) return

  for (const key in iframeArr) {
    funArr[key].forEach(item => {
      let funName = item.split('()')[0]
      let dok = iframeArr[key].replace(/\s/g, '')
      // const regex = /function btnAdd\(\) \{([\s\S]*?)\}/;
      // let str = '/function btnAdd\(\) \{([\s\S]*?)\}/'
      // const functionName = 'btnAdd';
      let aaa = new RegExp(`function ${funName}\\(\\)\\s*\\{\\s*([\\s\\S]*?)\\s*\\}`);
      const regex = /function btnAdd\(\) \{([\s\S]*?)\}/;
      let target = iframeArr[key].match(aaa)
      if (target) {
        const functionBody = target[1];

      } else {
        console.log("未匹配到 btnAdd 函数体");
      }
    })
  }
}

function getIframeSrc(iframe) {
  iframe = [...iframe]
  iframe = iframe.map(item => {
    return item.src
  })

  return iframe
}