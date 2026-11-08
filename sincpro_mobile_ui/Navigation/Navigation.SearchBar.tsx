import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import SearchSuggestions, {
  type SearchSuggestionsProps,
} from "@sincpro/mobile-ui/Navigation/Navigation.SearchSuggestions";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { appliedTextStyle } from "@sincpro/mobile-ui/theme/typography";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

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
  accessibilityLabel?: string;
  clearAccessibilityLabel?: string;
  suggestions?: SearchSuggestionsProps;
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
  accessibilityLabel,
  clearAccessibilityLabel = "Limpiar",
  suggestions,
}: SearchBarProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const body = (
    <View
      className={cn(
        "flex-row items-center gap-2 rounded-full px-4",
        focused ? "bg-bg-card" : "bg-bg-muted",
        className,
      )}
      style={{
        minHeight: 48,
        minWidth: 48,
        borderWidth: 1,
        borderColor: focused ? theme.border.focus : "transparent",
      }}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Icon
          color={focused ? theme.border.focus : theme.icon.tertiary}
          name="search"
          size={18}
        />
      </View>
      {editable ? (
        <TextInput
          accessibilityLabel={accessibilityLabel ?? placeholder}
          autoFocus={autoFocus}
          className="flex-1 text-text-primary"
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          returnKeyType="search"
          selectionColor={theme.primary}
          style={{
            ...appliedTextStyle("bodyReadable"),
            minHeight: 48,
            paddingVertical: 8,
          }}
          testID={testID ? `${testID}-input` : undefined}
          underlineColorAndroid="transparent"
          value={value}
        />
      ) : (
        <Typography.Text className="flex-1 text-text-tertiary" variant="bodyReadable">
          {value || placeholder}
        </Typography.Text>
      )}
      {editable && value.length > 0 ? (
        <Pressable
          accessibilityLabel={clearAccessibilityLabel}
          hitSlop={8}
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          style={{
            minHeight: 48,
            minWidth: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon color={theme.icon.tertiary} name="dismiss" size={18} />
        </Pressable>
      ) : null}
    </View>
  );

  if (!editable && onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel ?? placeholder}
        accessibilityRole="search"
        onPress={onPress}
        style={{ minHeight: 48, minWidth: 48 }}
        testID={testID}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View testID={testID}>
      {body}
      {focused && suggestions ? (
        <SearchSuggestions
          {...suggestions}
          onSelect={(suggestion) => {
            suggestions.onSelect(suggestion);
            setFocused(false);
            Keyboard.dismiss();
          }}
        />
      ) : null}
    </View>
  );
}

export default SearchBar;
