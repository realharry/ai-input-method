# AI Input Method - Emoji Picker

A modern Chrome extension that provides an intuitive emoji picker via the SidePanel UI. The side panel includes a searchable list of emojis organized by categories, allowing users to easily insert them into text fields on any webpage.

## Features

- 🎯 **Smart Insertion**: Automatically inserts emojis into the currently focused text field
- 📋 **Clipboard Fallback**: Copies emojis to clipboard when no text field is focused
- 🔍 **Advanced Search**: Search emojis by name, category, or keywords
- 🏷️ **Category Filtering**: Browse emojis by categories (Smileys, Animals, Food, etc.)
- 🎨 **Modern UI**: Built with React, TailwindCSS, and Shadcn components
- ⚡ **Fast & Responsive**: Optimized performance with TypeScript and Vite

## Tech Stack

- **TypeScript** - Type-safe development
- **React** - Modern UI framework
- **TailwindCSS** - Utility-first CSS styling
- **Shadcn** - Beautiful UI components
- **Vite** - Fast build tool and dev server
- **Chrome Extensions API** - Native browser integration

## Installation

### For Users

1. Download or clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `dist` folder

### For Developers

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-input-method
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

1. **Activate the extension**: Click the emoji picker icon in the Chrome toolbar or use the side panel
2. **Browse emojis**: Use category filters to browse different emoji categories
3. **Search**: Type in the search bar to find specific emojis by name or keywords
4. **Insert emojis**: 
   - Click any emoji while a text field is focused to insert it directly
   - Click any emoji when no text field is focused to copy it to clipboard
5. **Categories available**:
   - Smileys & Emotion 😀
   - People & Body 👋
   - Animals & Nature 🐶
   - Food & Drink 🍎
   - Activities ⚽
   - Travel & Places 🚗
   - Objects 📱
   - Symbols ❤️
   - Flags 🏁

## Development Scripts

- `npm run dev` - Start development build with file watching
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview the built extension

## Extension Structure

```
src/
├── components/          # React components
│   ├── SidePanel.tsx   # Main side panel component
│   ├── SearchBar.tsx   # Search functionality
│   ├── CategoryFilter.tsx # Category filtering
│   ├── EmojiGrid.tsx   # Emoji display grid
│   └── EmojiItem.tsx   # Individual emoji items
├── data/
│   └── emojis.ts       # Emoji data and utilities
├── utils/
│   └── cn.ts           # Utility functions
├── background.ts       # Chrome extension background script
├── content-script.ts   # Content script for text insertion
├── main.tsx           # React app entry point
├── App.tsx            # Main app component
├── globals.css        # Global styles
└── sidepanel.html     # Side panel HTML template
```

## How It Works

1. **Background Script**: Manages extension lifecycle and message passing
2. **Content Script**: Handles text field detection and emoji insertion on web pages
3. **Side Panel**: Provides the emoji picker interface using React
4. **Smart Insertion**: Detects focused text inputs and inserts emojis at cursor position
5. **Clipboard Integration**: Falls back to clipboard when no text field is active

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
