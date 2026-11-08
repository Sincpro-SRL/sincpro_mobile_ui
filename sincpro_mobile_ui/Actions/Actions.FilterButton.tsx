import type { IconName } from "@sincpro/mobile-ui/Display";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { FC, ReactNode } from "react";
import { ScrollView, View } from "react-native";

// The one filter chip of the DS: list headers, search, filter bars and the
// trigger of a filter sheet all render this shape.
const filterChip = tv({
  base: "flex-row items-center self-start gap-1.5 py-1.5 px-3.5 rounded-full",
  variants: {
    active: {
      true: "bg-primary",
      false: "bg-bg-muted",
    },
  },
  defaultVariants: { active: false },
});

const filterChipText = tv({
  variants: {
    active: {
      true: "text-text-on-primary font-semibold",
      false: "text-text-secondary",
    },
  },
  defaultVariants: { active: false },
});

/** The chip stays compact; the touch target grows to 48 points vertically. */
const TOUCH_SLOP = { top: 8, bottom: 8, left: 4, right: 4 } as const;

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  /** Leading icon, e.g. `filter` for the trigger of a filter sheet. */
  icon?: IconName;
  /** Trailing count, e.g. how many filters are applied. Hidden when 0. */
  count?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
  testID?: string;
}

export function FilterChip({
  label,
  active = false,
  onPress,
  icon,
  count,
  disabled = false,
  accessibilityLabel,
  className,
  testID,
}: FilterChipProps) {
  const theme = useTheme();
  const tint = active ? theme.text.onPrimary : theme.text.secondary;
  const textClass = filterChipText({ active });
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      className={filterChip({ active, className })}
      disabled={disabled}
      hitSlop={TOUCH_SLOP}
      onPress={onPress}
      testID={testID}
    >
      {icon ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Icon color={tint} name={icon} size={16} />
        </View>
      ) : null}
      <Typography.Text className={textClass} variant="bodySmall">
        {label}
      </Typography.Text>
      {count ? (
        <Typography.Text className={cn(textClass, "font-semibold")} variant="bodySmall">
          {count}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}

export interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
  /** Kept for compatibility: every filter button renders the same chip. */
  variant?: "default" | "mobile";
  disabled?: boolean;
  className?: string;
  testID?: string;
}

/** A filter toggle. Same chip as `ListViewV2.Header.Filters.Chip` and `Search.Filters`. */
export const FilterButton: FC<FilterButtonProps> = ({
  title,
  active,
  onPress,
  disabled = false,
  className,
  testID,
}) => (
  <FilterChip
    active={active}
    className={className}
    disabled={disabled}
    label={title}
    onPress={onPress}
    testID={testID}
  />
);

export interface FilterButtonGroupProps {
  children: ReactNode;
  layout?: "row" | "scroll" | "wrap";
  className?: string;
  testID?: string;
}

export function FilterButtonGroup({
  children,
  layout = "row",
  className,
  testID,
}: FilterButtonGroupProps) {
  if (layout === "scroll") {
    return (
      <ScrollView
        className={cn("py-1", className)}
        contentContainerStyle={{ gap: 8 }}
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        testID={testID}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View
      className={cn("flex-row gap-2 p-3", layout === "wrap" && "flex-wrap", className)}
      testID={testID}
    >
      {children}
    </View>
  );
}
