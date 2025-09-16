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
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0] && tabs[0].id != null) {
        const tab = tabs[0];
        const tabId = tab.id as number;
        
        // Check if we can inject content scripts on this tab
        if (tab.url?.startsWith('chrome://') || 
            tab.url?.startsWith('chrome-extension://') || 
            tab.url?.startsWith('edge://') || 
            tab.url?.startsWith('about:')) {
          console.log('Cannot inject content script on system page:', tab.url);
          return;
        }

        try {
          // Try to send message to existing content script
          await chrome.tabs.sendMessage(tabId, {
            type: 'INSERT_EMOJI',
            emoji: message.emoji
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log('Content script not available, attempting to inject:', errorMessage);
          
          try {
            // Try to inject the content script programmatically
            await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['content-script.js']
            });
            
            // Wait a moment for the script to initialize
            setTimeout(async () => {
              try {
                await chrome.tabs.sendMessage(tabId, {
                  type: 'INSERT_EMOJI',
                  emoji: message.emoji
                });
              } catch (retryError) {
                const retryErrorMessage = retryError instanceof Error ? retryError.message : 'Unknown error';
                console.log('Failed to inject emoji after script injection:', retryErrorMessage);
              }
            }, 100);
            
          } catch (injectionError) {
            const injectionErrorMessage = injectionError instanceof Error ? injectionError.message : 'Unknown error';
            console.log('Failed to inject content script:', injectionErrorMessage);
          }
        }
      }
    });
  }
});