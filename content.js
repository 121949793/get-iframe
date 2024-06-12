chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    document.body.style.backgroundColor = request.color;

    let getAllIframe = getArrIfm()
    sendResponse({ iframe: getIframeSrc(getAllIframe) });

    let totalFun = getIfmFuns(getAllIframe)
    let allIframeHTML = getAllIframeHTML(getAllIframe)
    let iframeFunURL = getIframeFunUrl(allIframeHTML, totalFun)
    console.log(iframeFunURL)
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
  // console.log(extractFunctionBody('btnAdd', DOM))
  return DOM
}
const extractFunctionBody = (functionName, scriptText) => {
  const functionStart = scriptText.indexOf(`function ${functionName}`);
  if (functionStart === -1) return null;

  let openBraces = 0;
  let functionBody = '';
  let i = functionStart;

  while (i < scriptText.length) {
    const char = scriptText[i];
    functionBody += char;
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces === 0 && functionBody.includes('{')) break;
    i++;
  }
  return functionBody;
};
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
  let obj = new Object()
  for (const key in iframeArr) {
    obj[key] = new Object()
    funArr[key].forEach(item => {
      let fun = extractFunctionBody(item, iframeArr[key])
      let str = findURL(fun)
      console.log(item, str, key)
      obj[key][item] = str
    })
  }
  return obj
}

function findURL(str) {
  // 正则表达式匹配 HTML 文件路径
  const htmlPathRegex = /'([^']*\.html)[^']*'/g;
  // 替换 HTML 文件路径
  const url = htmlPathRegex.exec(str)?.[1]

  return url
}

function getIframeSrc(iframe) {
  iframe = [...iframe]
  iframe = iframe.map(item => {
    return item.src
  })

  return iframe
}