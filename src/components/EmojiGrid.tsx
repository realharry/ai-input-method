import { type Emoji } from '../data/emojis';
import { EmojiItem } from './EmojiItem';

interface EmojiGridProps {
  emojis: Emoji[];
  onEmojiClick: (emoji: Emoji) => void;
}

export function EmojiGrid({ emojis, onEmojiClick }: EmojiGridProps) {
  if (emojis.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p>No emojis found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[600px] pr-2">
      {emojis.map((emoji, index) => (
        <EmojiItem
          key={`${emoji.emoji}-${index}`}
          emoji={emoji}
          onClick={onEmojiClick}
        />
      ))}
    </div>
  );
}