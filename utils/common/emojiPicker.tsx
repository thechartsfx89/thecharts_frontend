'use client';
import React from 'react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface AppEmojiPickerProps {
  onSelect: (emoji: EmojiClickData) => void;
  theme?: Theme;
}

const AppEmojiPicker: React.FC<AppEmojiPickerProps> = ({
  onSelect,
  theme = Theme.LIGHT,
}) => {
  return (
    <div className="z-50">
      <EmojiPicker
        onEmojiClick={onSelect}
        theme={theme}
        skinTonesDisabled={false}
        searchDisabled={false}
        lazyLoadEmojis={true}
        width={300}
        height={400}
      />
    </div>
  );
};

export default AppEmojiPicker;
