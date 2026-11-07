import { ICON_MAP, type IconName } from "@sincpro/mobile-ui/Display/icon-map";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { SymbolView } from "expo-symbols";
import type { FC } from "react";
import { type ColorValue, View, type ViewProps } from "react-native";

export type IconProps = Omit<ViewProps, "children"> & {
  name: IconName;
  size?: number;
  color?: ColorValue;
  className?: string;
};

const Icon: FC<IconProps> = ({
  name,
  size = 24,
  color,
  className,
  style,
  accessible,
  accessibilityLabel,
  accessibilityRole,
  ...viewProps
}) => {
  const theme = useTheme();
  if (typeof name !== "string" || !Object.hasOwn(ICON_MAP, name)) {
    throw new Error(`Unknown icon name: ${String(name)}`);
  }
  if (!Number.isFinite(size) || size <= 0) {
    throw new RangeError(`Invalid icon size: ${String(size)}`);
  }
  if (
    ["type", "customIcon", "fallback", "children"].some((key) =>
      Object.hasOwn(viewProps, key),
    )
  ) {
    throw new Error(
      "Display.Icon accepts semantic names, not icon families or custom renderers",
    );
  }

  const icon = ICON_MAP[name];

  return (
    <View
      {...viewProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? (accessibilityLabel ? "image" : undefined)}
      accessible={accessible ?? Boolean(accessibilityLabel)}
      className={cn("justify-center items-center", className)}
      style={style}
    >
      <SymbolView
        accessibilityElementsHidden
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        name={{ ios: icon.sf, android: icon.md, web: icon.md }}
        size={size}
        tintColor={color ?? theme.text.primary}
      />
    </View>
  );
};

export default Icon;
