console.log('background script executed!')

// And only enable extension on specific pages (page_action)
// called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
	if(!tab || !tab.url){
		return;
	}
  // If the tabs url starts with "http://specificsite.com"...
  if (tab.url.indexOf('https://mail.google.com') == 0 || tab.url.indexOf('http://mail.google.com') == 0) {
      // ... show the page action.
      chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);