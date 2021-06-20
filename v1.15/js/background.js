//the extension is on.
var isExtensionOn = true;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (request.cmd === "setOnOffState") {
          isExtensionOn = request.data.value;
      }
      if (request.cmd === "getOnOffState") {
          sendResponse(isExtensionOn);
      }
  });

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Removing all image from ' + tab.url + '!');
  chrome.tabs.executeScript({
    code: 'for (var i= document.images.length; i-->0;) document.images[i].parentNode.removeChild(document.images[i]);'
  });
});


