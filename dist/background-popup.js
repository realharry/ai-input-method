// Background script for popup-based emoji picker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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