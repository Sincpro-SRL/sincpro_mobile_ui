import type React from "react";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { Display } from "../Display";
import { theme } from "../theme";
import { cn, tv } from "../theme/tw";

const Icon = Display.Icon;

const searchBarContainer = tv({
  base: "flex-row items-center bg-bg-card rounded-lg px-2 h-10 shadow-sm",
  variants: {
    focused: {
      true: "border-2 border-border-focus",
      false: "border border-border-default",
    },
  },
  defaultVariants: { focused: false },
});

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn(searchBarContainer({ focused: isFocused }), className)}>
      <View className="mr-1 ml-0.5 items-center justify-center h-full">
        <Icon className="text-text-tertiary" name="search" size={18} type="ionicons" />
      </View>
      <TextInput
        className="flex-1 h-full text-sm py-0 px-1.5 text-text-primary"
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        placeholderTextColor={theme.text.tertiary}
        value={value}
      />
      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          className="mr-0.5 ml-1 items-center justify-center h-full px-1"
          onPress={() => onChangeText("")}
        >
          <Icon className="text-text-tertiary" name="x" size={18} type="feather" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SearchBar;
