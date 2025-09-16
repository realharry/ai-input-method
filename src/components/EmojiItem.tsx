import { type Emoji } from '../data/emojis';
import { cn } from '../utils/cn';

interface EmojiItemProps {
  emoji: Emoji;
  onClick: (emoji: Emoji) => void;
}

export function EmojiItem({ emoji, onClick }: EmojiItemProps) {
  const handleClick = () => {
    onClick(emoji);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center p-2 rounded-lg transition-colors",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "group"
      )}
      title={emoji.name}
    >
      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
        {emoji.emoji}
      </span>
      <span className="text-xs text-gray-600 text-center leading-tight max-w-full truncate">
        {emoji.name}
      </span>
    </button>
  );
}