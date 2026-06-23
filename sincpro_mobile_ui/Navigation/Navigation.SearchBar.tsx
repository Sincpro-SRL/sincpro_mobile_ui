import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { TextInput, View } from "react-native";

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  autoFocus?: boolean;
  editable?: boolean;
  onPress?: () => void;
  className?: string;
  testID?: string;
}

/**
 * **Pill** search bar (rounded-full), 2026 style (merge of Material 3 + iOS 26).
 * Use `editable={false}` + `onPress` for a trigger that navigates to the search screen.
 */
function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar",
  onSubmit,
  onClear,
  autoFocus,
  editable = true,
  onPress,
  className,
  testID,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const body = (
    <View
      className={cn(
        "flex-row items-center gap-2 rounded-full px-4",
        focused ? "bg-bg-card" : "bg-bg-muted",
        className,
      )}
      style={{
        height: 44,
        borderWidth: 1,
        borderColor: focused ? theme.border.focus : "transparent",
      }}
    >
      <Icon
        color={focused ? theme.border.focus : theme.icon.tertiary}
        name="search"
        size={18}
      />
      {editable ? (
        <TextInput
          autoFocus={autoFocus}
          className="flex-1 text-sm text-text-primary"
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          returnKeyType="search"
          value={value}
        />
      ) : (
        <Typography.Text className="flex-1 text-text-tertiary text-sm" numberOfLines={1}>
          {value || placeholder}
        </Typography.Text>
      )}
      {editable && value.length > 0 ? (
        <Pressable
          accessibilityLabel="Limpiar"
          hitSlop={8}
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
        >
          <Icon color={theme.icon.tertiary} name="close-circle" size={18} />
        </Pressable>
      ) : null}
    </View>
  );

  if (!editable && onPress) {
    return (
      <Pressable
        accessibilityLabel={placeholder}
        accessibilityRole="search"
        onPress={onPress}
        testID={testID}
      >
        {body}
      </Pressable>
    );
  }

  return <View testID={testID}>{body}</View>;
}

export default SearchBar;
