import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn, tv } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { FC, ReactNode } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const filterButton = tv({
  base: "rounded-lg items-center justify-center py-2 px-3 min-h-[36px]",
  variants: {
    active: {
      true: "bg-primary border-0",
      false: "bg-transparent border border-brand-primary",
    },
  },
  defaultVariants: { active: false },
});

const filterText = tv({
  base: "font-bold",
  variants: {
    active: {
      true: "text-white",
      false: "text-text-accent",
    },
  },
  defaultVariants: { active: false },
});

export interface FilterButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
  variant?: "default" | "mobile";
  disabled?: boolean;
  className?: string;
  testID?: string;
}

export const FilterButton: FC<FilterButtonProps> = ({
  title,
  active,
  onPress,
  variant = "default",
  disabled = false,
  className,
  testID,
}) => {
  const theme = useTheme();
  if (variant === "mobile") {
    return (
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="button"
        accessibilityState={{ selected: active, disabled }}
        activeOpacity={1 - theme.state.press}
        className={cn(
          "flex-row items-center self-start rounded-full px-3 py-2 gap-2 max-w-full",
          active ? "bg-container-primary" : "bg-bg-muted",
          className,
        )}
        disabled={disabled}
        onPress={onPress}
        style={{
          minHeight: 48,
          minWidth: 48,
        }}
        testID={testID}
      >
        {active ? (
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Icon color={theme.container.onPrimary} name="check" size={18} />
          </View>
        ) : null}
        <Typography.Text
          className={cn(
            "flex-shrink",
            active ? "text-container-on-primary" : "text-text-primary",
          )}
          variant="bodyLarge"
        >
          {title}
        </Typography.Text>
      </Pressable>
    );
  }
  return (
    <TouchableOpacity
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      activeOpacity={0.8}
      className={filterButton({ active, className })}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
    >
      <Typography.Text className={filterText({ active })} variant="buttonSmall">
        {title}
      </Typography.Text>
    </TouchableOpacity>
  );
};

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
