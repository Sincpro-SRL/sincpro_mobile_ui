import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface SearchHistoryProps {
  items: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  onClearAll?: () => void;
  title?: string;
  icon?: string;
  className?: string;
  testID?: string;
}

function SearchHistory({
  items,
  onSelect,
  onRemove,
  onClearAll,
  title = "Búsquedas recientes",
  icon = "time-outline",
  className,
  testID,
}: SearchHistoryProps) {
  if (items.length === 0) return null;

  return (
    <View className={cn("gap-1", className)} testID={testID}>
      <View className="flex-row items-center justify-between px-4 py-1">
        <Typography.Text className="text-text-secondary" semibold variant="bodySmall">
          {title}
        </Typography.Text>
        {onClearAll ? (
          <Pressable accessibilityLabel="Borrar todo" hitSlop={8} onPress={onClearAll}>
            <Typography.Text className="text-primary" variant="bodySmall">
              Borrar todo
            </Typography.Text>
          </Pressable>
        ) : null}
      </View>
      {items.map((value) => (
        <Pressable
          accessibilityLabel={value}
          className="flex-row items-center gap-3 px-4 py-2.5"
          key={value}
          onPress={() => onSelect(value)}
        >
          <Icon color={theme.icon.tertiary} name={icon} size={18} />
          <Typography.Text className="flex-1 text-text-primary" numberOfLines={1}>
            {value}
          </Typography.Text>
          <Pressable
            accessibilityLabel={`Quitar ${value}`}
            hitSlop={10}
            onPress={() => onRemove(value)}
          >
            <Icon color={theme.icon.tertiary} name="close" size={16} />
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}

export default SearchHistory;
