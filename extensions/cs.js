// STEP 1: this injects page.js into the actual page's js so we can interact with the page
var s = document.createElement("script");
s.src = chrome.extension.getURL("page.js");
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);
