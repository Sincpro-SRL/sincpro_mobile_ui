import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import type { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ComponentType } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface BottomNavItem {
  key: string;
  label?: string;
  /** Icon font name (Display.Icon). Provide this OR `customIcon`. */
  icon?: string;
  activeIcon?: string;
  /** Brand/custom SVG icon component. Takes precedence over `icon` (for non-font brand marks). */
  customIcon?: ComponentType<CustomIconProps>;
  badge?: string | number;
}

export interface BottomNavCenterAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  value: string;
  onChange: (key: string) => void;
  /** Show the text label under each icon. `false` = icon-only. */
  showLabels?: boolean;
  /** Elevated center FAB (delivery/social apps). Splits items left/right around it. */
  centerAction?: BottomNavCenterAction;
  /** Reserve the bottom inset (insets.bottom). Auto-disabled for `floating`. */
  safeArea?: boolean;
  /** `bar` = full-width docked bar; `floating` = self-contained rounded pill (shadow, margins). */
  shape?: "bar" | "floating";
  /** Active-tab indicator: `none` (color only) or `pill` (filled primary behind the icon). */
  indicator?: "none" | "pill";
  /** [bar only] Top hairline + card surface. Ignored for `floating` (the pill is the surface). */
  bordered?: boolean;
  /** Token for the active tab/pill color. `primary` (default) or `accent` (e.g. green CTA brand). */
  activeColor?: "primary" | "accent";
  className?: string;
  testID?: string;
}

/**
 * The single bottom-navigation component. Extensible by props, not by forking:
 * - `shape`: docked `bar` or `floating` rounded pill (the "flotante / pastilla" look).
 * - `showLabels`: icon+label or icon-only.
 * - `indicator`: `none` (color) or `pill` (filled active state, Material 3).
 * - `centerAction`: elevated center FAB for a primary action.
 * Active color comes from `primary` (themeable). Replaces the legacy `TabNavigatorLayout`.
 */
function BottomNav({
  items,
  value,
  onChange,
  showLabels = true,
  centerAction,
  safeArea = true,
  shape = "bar",
  indicator = "none",
  bordered = true,
  activeColor = "primary",
  className,
  testID,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const floating = shape === "floating";
  const bottomPad = floating ? 6 : safeArea ? insets.bottom : 0;
  const activeTint = activeColor === "accent" ? theme.accent : theme.primary;

  // Radius via inline style (RN-reliable; NativeWind arbitrary radii don't always compile).
  const containerClass = floating
    ? "flex-row items-center bg-bg-card px-2"
    : cn("flex-row items-center", bordered && "bg-bg-card border-t border-border-light");
  const containerStyle = floating
    ? {
        borderRadius: 32,
        paddingBottom: bottomPad,
        paddingTop: 6,
        minHeight: 64,
        backgroundColor: theme.bg.card,
        ...theme.shadow.lg,
      }
    : { paddingBottom: bottomPad, minHeight: 56 };

  const renderItem = (item: BottomNavItem) => {
    const active = item.key === value;
    const pill = indicator === "pill" && active;
    const iconColor = pill ? theme.icon.inverse : active ? activeTint : theme.icon.secondary;
    const labelColor = active ? activeTint : theme.icon.secondary;
    return (
      <Pressable
        accessibilityLabel={item.label ?? item.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        className="flex-1 items-center justify-center py-1.5"
        key={item.key}
        onPress={() => onChange(item.key)}
      >
        <View
          className={pill ? "px-5 py-1.5" : undefined}
          style={pill ? { borderRadius: 999, backgroundColor: activeTint } : undefined}
        >
          {item.customIcon ? (
            <Icon color={iconColor} customIcon={item.customIcon} size={24} type="custom" />
          ) : (
            <Icon
              color={iconColor}
              name={(active ? (item.activeIcon ?? item.icon) : item.icon) ?? ""}
              size={24}
            />
          )}
          {item.badge != null ? (
            <View
              className="absolute bg-danger rounded-full min-w-[16px] h-4 px-1 items-center justify-center"
              style={{ top: -4, right: -10, borderWidth: 2, borderColor: theme.bg.card }}
            >
              <Typography.Text
                style={{ color: theme.text.inverse, fontSize: 9, lineHeight: 11 }}
              >
                {item.badge}
              </Typography.Text>
            </View>
          ) : null}
        </View>
        {showLabels && item.label ? (
          <Typography.Text
            numberOfLines={1}
            semibold={active}
            style={{ color: labelColor, fontSize: 11, marginTop: 3 }}
          >
            {item.label}
          </Typography.Text>
        ) : null}
      </Pressable>
    );
  };

  const renderCenterFab = () => (
    <Pressable
      accessibilityLabel={centerAction?.accessibilityLabel ?? "Acción"}
      accessibilityRole="button"
      className="items-center justify-center bg-primary rounded-full"
      onPress={centerAction?.onPress}
      style={{
        width: 52,
        height: 52,
        marginTop: -20,
        marginHorizontal: 6,
        ...theme.shadow.md,
      }}
    >
      <Icon color={theme.icon.inverse} name={centerAction?.icon ?? "add"} size={26} />
    </Pressable>
  );

  let content;
  if (centerAction) {
    const mid = Math.ceil(items.length / 2);
    content = (
      <>
        {items.slice(0, mid).map(renderItem)}
        {renderCenterFab()}
        {items.slice(mid).map(renderItem)}
      </>
    );
  } else {
    content = items.map(renderItem);
  }

  return (
    <View className={cn(containerClass, className)} style={containerStyle} testID={testID}>
      {content}
    </View>
  );
}

export default BottomNav;
export { BottomNav };
