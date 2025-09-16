import { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { EmojiGrid } from './EmojiGrid';
import { emojis, searchEmojis, getEmojisByCategory, type Emoji, type EmojiCategory } from '../data/emojis';

export function SidePanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory | 'All'>('All');

  const filteredEmojis = useMemo(() => {
    let result = emojis;

    // Apply category filter
    if (selectedCategory !== 'All') {
      result = getEmojisByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = searchEmojis(searchQuery);
      // If we have a category filter and search, combine both
      if (selectedCategory !== 'All') {
        result = result.filter(emoji => emoji.category === selectedCategory);
      }
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const handleEmojiClick = async (emoji: Emoji) => {
    try {
      // Try to insert into active text field via background script
      chrome.runtime.sendMessage({
        type: 'INSERT_EMOJI',
        emoji: emoji.emoji
      });

      // Also copy to clipboard as fallback
      await navigator.clipboard.writeText(emoji.emoji);
      
      // Show visual feedback
      showToast(`${emoji.emoji} copied!`);
    } catch (error) {
      console.error('Failed to handle emoji click:', error);
      showToast('Failed to copy emoji');
    }
  };

  const showToast = (message: string) => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed top-4 right-4 bg-black text-white px-3 py-2 rounded-md text-sm z-50 transition-opacity opacity-100';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900 mb-4">Emoji Picker</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search emojis..."
        />
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <EmojiGrid
          emojis={filteredEmojis}
          onEmojiClick={handleEmojiClick}
        />
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        Click any emoji to insert into text field or copy to clipboard
      </div>
    </div>
  );
}