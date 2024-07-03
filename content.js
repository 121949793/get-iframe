chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
  if (request.action === "highlightText") {
    // document.body.style.backgroundColor = request.color;

  }
  if (request.action === 'openFloatingWindow') {
    createFloatingWindow();
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
  }
  return DOM
}
function getIframeId(iframe) {
}
function getIframeDomHTML(iframe) {
  let iframeDocument = iframe.contentWindow.document;
  let DOM = iframeDocument.documentElement.outerHTML;

  return DOM
}
const extractFunctionBody = (functionName, scriptText) => {
  const functionRegex = new RegExp(`(?:function\\s+${functionName}\\s*\\(|${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>)`, 'g');
  const match = functionRegex.exec(scriptText);
  if (!match) return null;

  const functionStart = match.index;
  let openBraces = 0;
  let functionBody = '';
  let i = scriptText.indexOf('{', functionStart);

  while (i < scriptText.length) {
    const char = scriptText[i];
    functionBody += char;
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces === 0 && functionBody.includes('{')) break;
    i++;
  }

  const bodyStart = functionBody.indexOf('{') + 1;
  const bodyEnd = functionBody.lastIndexOf('}');
  functionBody = functionBody.substring(bodyStart, bodyEnd).trim();
  const urlPattern = /https?:\/\/[^\s"]+\.html\b|\.\/[^\s"]+\.html\b/g;
  functionBody = functionBody.match(urlPattern)?.[0]
  if (functionBody && functionBody.includes('menu')) functionBody = '.' + functionBody.split('menu')[1]
  return functionBody
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

    funArr[nums].forEach(item => {
      // let fun = extractFunctionBody(item, iframeArr[key])
      let name = getFunName(item, iframeArr[key])
      let str = extractFunctionBody(item, iframeArr[key])
      let keyName = item.split('()')[0]
      obj[key1][keyName] = new Object()
      obj[key1][keyName].path = str
      obj[key1][keyName].name = name
    })
    nums++

  }
  return obj
}



function getIframeSrc(iframe) {
  return [...iframe].map(item => item.src)
}



function concatUrl(ifArr, funArr) {
  let index = 0
  for (const key in funArr) {
    let item = funArr[key]
    let ifurl = ifArr[index]
    for (const val in item) {
      let src = item[val].path
      if (src) {
        src = src.slice(1)
        item[val].path = 'menu' + src
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

  if (funDom.length != 1) {
    console.log('再次处理')
    return
  }
  return funDom[0]?.title
}
let observer = null
function createObserver() {
  queueMicrotask(() => { observerCallback() });
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
    observerCallback()
    // chrome.runtime.sendMessage({ action: 'currentIframe', info: showIframeId })
  };
  // 创建一个观察者实例并传入回调函数
  observer = new MutationObserver(callback);

  // 监听目标节点
  observer.observe(targetNode, config);
}
function destroyObserver() {
  observer.disconnect();
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
  let temparr = [...arr].map(item => '.' + item.src.split('?')[0].split('menu')[1])
  console.log(temparr, 1111111111111)
  return temparr
}

function createFloatingWindow() {
  // 检查是否已存在悬浮窗口
  if (document.getElementById('floatingWindow')) {
    return;
  }
  createObserver()
  // 创建悬浮窗口容器
  const floatingWindow = document.createElement('div');
  floatingWindow.id = 'floatingWindow';
  // console.log(boxStyle)
  assignFun(floatingWindow.style, boxStyle)

  // 创建窗口标题栏
  const titleBar = document.createElement('div');
  titleBar.style.backgroundColor = '#f1f1f1';
  titleBar.style.padding = '10px';
  titleBar.style.cursor = 'move';
  titleBar.id = 'chromeWindow'
  titleBar.innerHTML = `<strong>Floating Window</strong>`;
  floatingWindow.appendChild(titleBar);

  // 创建关闭按钮
  const closeButton = document.createElement('button');

  closeButton.innerText = 'Close';
  closeButton.style.float = 'right';
  closeButton.addEventListener('click', () => {
    destroyObserver()
    floatingWindow.remove();
  });
  titleBar.appendChild(closeButton);

  // 加入自定义内容
  const content = document.createElement('div');
  content.id = 'btns';
  floatingWindow.appendChild(content);

  // 将悬浮窗口添加到页面中
  document.body.appendChild(floatingWindow);

  // 添加拖拽功能
  let isDragging = false;
  let offsetX, offsetY;

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
    offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      floatingWindow.style.left = `${e.clientX - offsetX}px`;
      floatingWindow.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}


function getAllIframeFuns() {
  let getAllIframe = getArrIfm()
  let tempArr = getIframeSrc(getAllIframe)
  let allIframeId = getAllIframeId(getAllIframe)
  let barNames = getAllBarName(allIframeId)
  // console.log(allIfCompleteUrl)

  let totalIndex = findIframeIndex(getAllIframe)
  let totalFun = getIfmFuns(getAllIframe)
  let allIframeHTML = getAllIframeHTML(getAllIframe)
  let iframeFunURL = getIframeFunUrl(allIframeHTML, totalFun, totalIndex)
  let allIfCompleteUrl = concatUrl(tempArr, iframeFunURL)
  let info = allIfCompleteUrl

  let showIframeId = getShowIframe().id
  let target = info[showIframeId]
  let ttt = barNames.find(item => item.key == showIframeId).value
  updateWindowTitle(ttt)
  return target
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
  let targetDom = document.querySelector('#floatingWindow #btns')
  targetDom.innerHTML = ''
  let str = ''
  for (const key in totalIF) {
    let domName = `iframeHanlder${key}`
    let item = totalIF[key]
    const content = document.createElement('div');
    content.id = domName;
    content.dataset.src = item.path;
    content.textContent = item.name;
    assignFun(content.style, btnStyle)
    if (!item.path) {
      content.style.backgroundColor = '#a2a2a2'
    }
    targetDom.appendChild(content);
  }

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


function observerCallback() {
  let target = getAllIframeFuns()
  appendHtml(target)
}

function getAllIframeId(iframe) {
  return [...iframe].map(item => item.id)

}

function getAllBarName(ids) {
  let barNameArr = ids.map(item => {
    let targetId = 'tabs_' + item.split('tabs_iframe_')[1]
    let name = document.querySelector(`#${targetId}`).childNodes[0].title
    return {
      key: item,
      value: name
    }
  })

  return barNameArr
}

function updateWindowTitle(val) {
  let targetDom = document.querySelector('#chromeWindow > strong')
  console.log(targetDom)
  targetDom.innerHTML = val
}