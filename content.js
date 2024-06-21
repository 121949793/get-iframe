chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    // document.body.style.backgroundColor = request.color;

    let getAllIframe = getArrIfm()
    let tempArr = getIframeSrc(getAllIframe)
    // sendResponse({ iframe: splitUrl(tempArr) });
    let totalIndex = findIframeIndex(getAllIframe)
    console.log(totalIndex)
    let totalFun = getIfmFuns(getAllIframe)
    let allIframeHTML = getAllIframeHTML(getAllIframe)
    console.log(totalIndex)

    let iframeFunURL = getIframeFunUrl(allIframeHTML, totalFun, totalIndex)
    let allIfCompleteUrl = concatUrl(tempArr, iframeFunURL)
    console.log(allIfCompleteUrl)
    sendResponse({ iframe: allIfCompleteUrl });
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

function getIframeFunUrl(iframeArr, funArr, indexArr) {
  // if (iframeArr.length == 0 || funArr.length == 0) return
  // if (iframeArr.length != funArr.length) return
  let obj = new Object()
  let nums = 0
  for (const key in iframeArr) {
    let key1 = key.split('()')[0]
    obj[key1] = new Object()
    obj[key1]['index'] = {
      name: 'index',
      path: indexArr[nums]
    }
    console.log(indexArr[nums], 12312)
    funArr[nums].forEach(item => {
      let fun = extractFunctionBody(item, iframeArr[key])
      let name = getFunName(item, iframeArr[key])
      let str = findURL(fun)
      let keyName = item.split('()')[0]
      obj[key1][keyName] = new Object()
      obj[key1][keyName].path = str
      obj[key1][keyName].name = name
    })
    nums++

  }
  console.log(JSON.parse(JSON.stringify(obj)))
  return obj
}

function findURL(str) {
  // console.log(str)
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



function concatUrl(ifArr, funArr) {
  let index = 0
  for (const key in funArr) {
    let item = funArr[key]
    let ifurl = ifArr[index]
    for (const val in item) {
      let src = item[val].path
      if (src) {
        let Infix = src?.match(/\.\.\/([^/]+)/)?.[1]
        let suffix = src.split(Infix + '/')[1]
        let prefix = ifurl.split(Infix)[0]
        item[val].path = prefix + Infix + suffix
      }
    }
    index++
  }
  return funArr
}


function getFunName(funName, htmlString) {
  var parser = new DOMParser();
  var document = parser.parseFromString(htmlString, 'text/html');
  let funDom = document.querySelectorAll(`[onclick='${funName}']`)
  console.log(funDom)
  if (funDom.length != 1) {
    console.log('再次处理')
    return
  }
  return funDom[0]?.title
}
getHtmlChange()
function getHtmlChange() {

  const targetNode = document.getElementById('ContentPannel');

  // 配置选项
  const config = {
    childList: true, // 监听子节点的变动
    subtree: true,   // 监听子树下所有节点
    attributes: true, // 监听属性的变动
    characterData: false // 监听节点内容或文本的变动
  };

  // 回调函数，当监控的元素发生变化时执行
  const callback = function (mutationsList, observer) {
    let showIframeId = getShowIframe().id
    chrome.runtime.sendMessage({ action: 'currentIframe', info: showIframeId })

  };

  // 创建一个观察者实例并传入回调函数
  const observer = new MutationObserver(callback);

  // 监听目标节点
  observer.observe(targetNode, config);
}

function getShowIframe() {
  const container = document.getElementById('ContentPannel');
  const iframes = container.getElementsByTagName('iframe');
  let blockIframes;
  for (let iframe of iframes) {
    const displayStyle = window.getComputedStyle(iframe).display;
    if (displayStyle !== 'none') {
      blockIframes = iframe
    }
  }
  return blockIframes
}
function findIframeIndex(arr) {
  return [...arr].map(item => '...' + item.src.split('?')[0].split('menu')[1])
}

