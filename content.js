chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    // document.body.style.backgroundColor = request.color;

    let getAllIframe = getArrIfm()
    let tempArr = getIframeSrc(getAllIframe)
    sendResponse({ iframe: splitUrl(tempArr) });

    let totalFun = getIfmFuns(getAllIframe)
    let allIframeHTML = getAllIframeHTML(getAllIframe)
    let iframeFunURL = getIframeFunUrl(allIframeHTML, totalFun)
    let allIfCompleteUrl = concatUrl(tempArr, iframeFunURL)
    console.log(allIfCompleteUrl)
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
function getIframeId(iframe) {
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
  let totalFun = new Object()
  allIfm.forEach(item => {
    let ifDom = getIframeDomHTML(item)
    totalFun[item.id] = ifDom
  })
  return totalFun
}
function getIfmFuns(allIfm) {
  let totalFun = []
  allIfm.forEach(item => {
    let ifDom = getIframeDom(item)
    let bars = ifDom.querySelector('#toolsOther')?.querySelectorAll('a')
    bars = bars ? bars : []
    bars = [...bars]
    funArr = bars.map(node => node.attributes['onclick'].nodeValue)
    totalFun.push(funArr)
  })
  return totalFun
}

function getIframeFunUrl(iframeArr, funArr) {
  // if (iframeArr.length == 0 || funArr.length == 0) return
  // if (iframeArr.length != funArr.length) return
  let obj = new Object()
  let nums = 0
  for (const key in iframeArr) {
    console.log(key)
    obj[key] = new Object()
    funArr[nums].forEach(item => {
      let fun = extractFunctionBody(item, iframeArr[key])
      let str = findURL(fun)
      obj[key][item] = str
    })
    nums++
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

function splitUrl(arr) {
  return arr.map(item => {
    if (item) {
      return item.split('http://localhost:52072')[1]
    } else {
      return ''
    }
  })
}

function concatUrl(ifArr, funArr) {
  let index = 0
  for (const key in funArr) {
    let item = funArr[key]
    let ifurl = ifArr[index]
    for (const val in item) {
      let src = item[val]
      if (src) {
        let Infix = src?.match(/\.\.\/([^/]+)/)?.[1]
        let suffix = src.split(Infix + '/')[1]
        let prefix = ifurl.split(Infix)[0]
        item[val] = prefix + Infix + suffix
      }
    }
    index++
  }
  return funArr
}