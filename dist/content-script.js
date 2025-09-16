if(window.emojiPickerContentScript)console.log("Emoji picker content script already loaded");else{let r=function(e){if(console.log("Attempting to insert emoji:",e,"into element:",n),!n){console.log("No focused element, copying to clipboard"),u(e),s("Emoji copied to clipboard!");return}n.contentEditable==="true"?(console.log("Inserting into contentEditable element"),d(n,e)):(console.log("Inserting into input/textarea element"),a(n,e)),s(`${e} inserted!`)},a=function(e,t){const o=e.selectionStart||0,i=e.selectionEnd||0,c=e.value,p=c.slice(0,o)+t+c.slice(i);e.value=p;const l=o+t.length;e.setSelectionRange(l,l),e.dispatchEvent(new Event("input",{bubbles:!0})),e.focus()},d=function(e,t){const o=window.getSelection();if(!o||o.rangeCount===0){e.innerHTML+=t;return}const i=o.getRangeAt(0);i.deleteContents();const c=document.createTextNode(t);i.insertNode(c),i.setStartAfter(c),i.collapse(!0),o.removeAllRanges(),o.addRange(i),e.dispatchEvent(new Event("input",{bubbles:!0}))},u=function(e){navigator.clipboard.writeText(e).then(()=>{console.log("Emoji copied to clipboard:",e)}).catch(t=>{console.error("Failed to copy emoji to clipboard:",t)})},s=function(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
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
    `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t)},300)},2e3)};window.emojiPickerContentScript=!0;let n=null;document.addEventListener("focusin",e=>{const t=e.target;if(t.tagName==="INPUT"||t.tagName==="TEXTAREA"){const o=t;(t.tagName==="TEXTAREA"||t.tagName==="INPUT"&&["text","search","url","tel","email","password"].includes(t.type))&&(n=o,console.log("Focused on text input:",t.tagName,t.type))}else t.contentEditable==="true"&&(n=t,console.log("Focused on contentEditable element"))}),document.addEventListener("focusout",()=>{console.log("Focus lost from text input"),n=null}),chrome.runtime.onMessage.addListener((e,t,o)=>{console.log("Content script received message:",e),e.type==="INSERT_EMOJI"&&(r(e.emoji),o({success:!0}))}),console.log("Emoji picker content script loaded successfully")}
