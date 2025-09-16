// Background script for the Chrome extension
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel when the extension icon is clicked
  if (tab.id) {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Enable the side panel for all tabs
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status === 'complete' && tab.url) {
    // Enable the side panel for this tab
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  }
});

// Handle messages from content script and side panel
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'INSERT_EMOJI') {
    // Forward the emoji insertion request to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'INSERT_EMOJI',
          emoji: message.emoji
        });
      }
    });
  }
});