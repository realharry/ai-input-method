// Background script for the Chrome extension
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel when the extension icon is clicked
  if (tab.windowId) {
    chrome.sidePanel.open({ windowId: tab.windowId });
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