// Content script to handle emoji insertion into text fields

// Track the currently focused text element
let currentFocusedElement: HTMLInputElement | HTMLTextAreaElement | null = null;

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
    }
  } else if (target.contentEditable === 'true') {
    // Handle contentEditable elements
    currentFocusedElement = target as any;
  }
});

// Listen for focus out events
document.addEventListener('focusout', () => {
  currentFocusedElement = null;
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'INSERT_EMOJI') {
    insertEmojiAtCursor(message.emoji);
  }
});

function insertEmojiAtCursor(emoji: string) {
  if (!currentFocusedElement) {
    // If no text field is focused, copy to clipboard as fallback
    copyToClipboard(emoji);
    return;
  }

  if (currentFocusedElement.contentEditable === 'true') {
    // Handle contentEditable elements
    insertIntoContentEditable(currentFocusedElement as HTMLElement, emoji);
  } else {
    // Handle input and textarea elements
    insertIntoInputElement(currentFocusedElement, emoji);
  }
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
  navigator.clipboard.writeText(text).then(() => {
    console.log('Emoji copied to clipboard:', text);
  }).catch(err => {
    console.error('Failed to copy emoji to clipboard:', err);
  });
}