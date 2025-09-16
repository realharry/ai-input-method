# Chrome Extension Version Switching Guide

This extension includes both **popup** and **side panel** implementations for maximum compatibility.

## Current Configuration: Popup Version
- ✅ Universal compatibility (Chrome 88+)
- ✅ Lightweight popup interface
- ✅ 120+ emojis across 7 categories

## To Switch to Side Panel Version:

### Requirements:
- Chrome 114 or later
- Developer mode enabled

### Steps:
1. **Replace manifest file:**
   ```bash
   # In the dist/ folder:
   cp manifest.json manifest-popup-backup.json  # backup current
   cp manifest-full.json manifest.json           # switch to side panel
   ```

2. **Replace background script:**
   ```bash
   cp background.js background-popup-backup.js  # backup current  
   cp background-original.js background.js      # switch to side panel
   ```

3. **Reload extension in Chrome:**
   - Go to `chrome://extensions/`
   - Click the reload button for this extension
   - Click the extension icon to open the side panel

### Side Panel Features:
- ✅ Modern React-based interface
- ✅ 300+ emojis across 9 categories  
- ✅ Advanced search and filtering
- ✅ Responsive side panel layout
- ✅ Full TypeScript implementation

## To Switch Back to Popup:
```bash
cp manifest-popup-backup.json manifest.json
cp background-popup-backup.js background.js
```

## File Reference:
- `popup.html` - Popup interface
- `sidepanel.html` - Side panel interface (React-based)
- `manifest-popup.json` - Popup configuration  
- `manifest-full.json` - Side panel configuration
- `background-popup.js` - Popup background script
- `background-original.js` - Side panel background script