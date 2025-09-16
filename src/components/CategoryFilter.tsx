import { emojiCategories, type EmojiCategory } from '../data/emojis';
import { cn } from '../utils/cn';

interface CategoryFilterProps {
  selectedCategory: EmojiCategory | 'All';
  onCategoryChange: (category: EmojiCategory | 'All') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      <button
        onClick={() => onCategoryChange('All')}
        className={cn(
          "px-3 py-1 text-xs rounded-full transition-colors",
          selectedCategory === 'All'
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        All
      </button>
      {emojiCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-3 py-1 text-xs rounded-full transition-colors",
            selectedCategory === category
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}