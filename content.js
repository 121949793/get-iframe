chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    document.body.style.backgroundColor = request.color;

    let getAllIframe = document.querySelectorAll('iframe')
    getAllIframe.forEach(item => {
      var iframeDocument = item.contentWindow.document;
      var iframeHTML = iframeDocument.documentElement;
      console.log(iframeHTML)
    })
    console.log(getAllIframe)
    sendResponse({ status: "Color changed to " + request.color });
  }
});

