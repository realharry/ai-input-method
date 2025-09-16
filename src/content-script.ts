// Content script to handle emoji insertion into text fields

// Prevent multiple injections of the same script
if ((window as any).emojiPickerContentScript) {
  console.log('Emoji picker content script already loaded');
} else {
  (window as any).emojiPickerContentScript = true;

  // Track the currently focused text element
  let currentFocusedElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement | null = null;

  // Listen for focus events on text inputs
  document.addEventListener('focusin', (event) => {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const element = target as HTMLInputElement | HTMLTextAreaElement;
      
      // Check if it's a text input type
      if (target.tagName === 'TEXTAREA' || 
          (target.tagName === 'INPUT' && 
           ['text', 'search', 'url', 'tel', 'email', 'password'].includes((target as HTMLInputElement).type))) {
        currentFocusedElement = element;
        console.log('Focused on text input:', target.tagName, (target as HTMLInputElement).type);
      }
    } else if (target.contentEditable === 'true') {
      // Handle contentEditable elements
      currentFocusedElement = target;
      console.log('Focused on contentEditable element');
    }
  });

  // Listen for focus out events
  document.addEventListener('focusout', () => {
    console.log('Focus lost from text input');
    currentFocusedElement = null;
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    console.log('Content script received message:', message);
    if (message.type === 'INSERT_EMOJI') {
      insertEmojiAtCursor(message.emoji);
      _sendResponse({ success: true });
    }
  });

  function insertEmojiAtCursor(emoji: string) {
    console.log('Attempting to insert emoji:', emoji, 'into element:', currentFocusedElement);
    
    if (!currentFocusedElement) {
      // If no text field is focused, copy to clipboard as fallback
      console.log('No focused element, copying to clipboard');
      copyToClipboard(emoji);
      showToast('Emoji copied to clipboard!');
      return;
    }

    if (currentFocusedElement.contentEditable === 'true') {
      // Handle contentEditable elements
      console.log('Inserting into contentEditable element');
      insertIntoContentEditable(currentFocusedElement, emoji);
    } else {
      // Handle input and textarea elements
      console.log('Inserting into input/textarea element');
      insertIntoInputElement(currentFocusedElement as HTMLInputElement | HTMLTextAreaElement, emoji);
    }
    
    showToast(`${emoji} inserted!`);
  }

  function insertIntoInputElement(element: HTMLInputElement | HTMLTextAreaElement, emoji: string) {
    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const value = element.value;
    
    // Insert emoji at cursor position
    const newValue = value.slice(0, start) + emoji + value.slice(end);
    element.value = newValue;
    
    // Set cursor position after the inserted emoji
    const newCursorPosition = start + emoji.length;
    element.setSelectionRange(newCursorPosition, newCursorPosition);
    
    // Trigger input event to notify any listeners
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.focus();
  }

  function insertIntoContentEditable(element: HTMLElement, emoji: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // If no selection, append to the end
      element.innerHTML += emoji;
      return;
    }
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
    
    // Move cursor after the inserted emoji
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function copyToClipboard(text: string) {
    // Modern clipboard API with proper error handling
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('Emoji copied to clipboard:', text);
      }).catch(err => {
        console.error('Failed to copy emoji to clipboard:', err);
        // Fallback to legacy method
        fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopyToClipboard(text);
    }
  }

  function fallbackCopyToClipboard(text: string) {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Try to copy using the older execCommand method
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        console.log('Emoji copied to clipboard using fallback method:', text);
      } else {
        console.error('Fallback copy method failed');
        showToast('Copy failed - please copy manually: ' + text);
      }
    } catch (err) {
      console.error('Fallback copy method error:', err);
      showToast('Copy failed - please copy manually: ' + text);
    }
  }

  function showToast(message: string) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 10000;
      opacity: 1;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  }

  console.log('Emoji picker content script loaded successfully');
}