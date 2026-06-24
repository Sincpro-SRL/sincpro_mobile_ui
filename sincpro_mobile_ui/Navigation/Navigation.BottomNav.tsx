import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import type { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
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

/**
 * Active-tab indicator style:
 * - `none`: color only.
 * - `pill`: filled round pill behind the icon.
 * - `pill-text`: extended pill with icon + label inside (inactive = icon only).
 * - `bar`: top accent bar over the active item (label below).
 * - `glow`: glowing dot under the active icon (pairs with `tone="dark"`).
 */
export type BottomNavIndicator = "none" | "pill" | "pill-text" | "bar" | "glow";

export interface BottomNavProps {
  items: BottomNavItem[];
  value: string;
  onChange: (key: string) => void;
  /** Show the text label under each icon. `false` = icon-only. */
  showLabels?: boolean;
  /** Elevated center FAB (delivery/social apps). Splits items left/right around it. */
  centerAction?: BottomNavCenterAction;
  /** Reserve the bottom inset (insets.bottom). Auto-disabled for `floating`/`dark`. */
  safeArea?: boolean;
  /** `bar` = full-width docked bar; `floating` = self-contained rounded pill (shadow, margins). */
  shape?: "bar" | "floating";
  /** Surface tone. `dark` renders a dark rounded bar (pairs with `glow`). */
  tone?: "light" | "dark";
  /** Active-tab indicator style (see BottomNavIndicator). */
  indicator?: BottomNavIndicator;
  /** [light bar only] Top hairline + card surface. */
  bordered?: boolean;
  /** Token for the active color. `primary` (default) or `accent` (e.g. green CTA brand). */
  activeColor?: "primary" | "accent";
  className?: string;
  testID?: string;
}

const DARK_SURFACE = "#15181B";

/**
 * The single bottom-navigation component. Extensible by props, not by forking:
 * `shape` (bar/floating), `tone` (light/dark), `indicator` (none/pill/pill-text/bar/glow),
 * `showLabels`, `centerAction` (FAB), `activeColor`. Replaces the legacy `TabNavigatorLayout`.
 */
function BottomNav({
  items,
  value,
  onChange,
  showLabels = true,
  centerAction,
  safeArea = true,
  shape = "bar",
  tone = "light",
  indicator = "none",
  bordered = true,
  activeColor = "primary",
  className,
  testID,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dark = tone === "dark";
  const rounded = shape === "floating" || dark;
  const bottomPad = rounded ? 6 : safeArea ? insets.bottom : 0;

  const activeTint = activeColor === "accent" ? theme.accent : theme.primary;
  const onActive = activeColor === "accent" ? theme.text.onAccent : theme.icon.inverse;
  const inactiveColor = dark ? "rgba(255,255,255,0.55)" : theme.icon.secondary;

  const surfaceColor = dark ? DARK_SURFACE : theme.bg.card;
  const containerStyle = rounded
    ? {
        borderRadius: 32,
        paddingBottom: bottomPad,
        paddingTop: 6,
        paddingHorizontal: 6,
        minHeight: 64,
        backgroundColor: surfaceColor,
        ...theme.shadow.lg,
      }
    : {
        paddingBottom: bottomPad,
        minHeight: 56,
        backgroundColor: surfaceColor,
        ...(bordered ? { borderTopWidth: 1, borderTopColor: theme.border.light } : null),
      };

  const renderIconNode = (item: BottomNavItem, active: boolean, color: string) => {
    const node = item.customIcon ? (
      <Icon color={color} customIcon={item.customIcon} size={24} type="custom" />
    ) : (
      <Icon
        color={color}
        name={(active ? (item.activeIcon ?? item.icon) : item.icon) ?? ""}
        size={24}
      />
    );
    return (
      <View>
        {node}
        {item.badge != null ? (
          <View
            className="absolute bg-danger rounded-full min-w-[16px] h-4 px-1 items-center justify-center"
            style={{ top: -4, right: -10, borderWidth: 2, borderColor: surfaceColor }}
          >
            <Typography.Text
              style={{ color: theme.text.inverse, fontSize: 9, lineHeight: 11 }}
            >
              {item.badge}
            </Typography.Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderItem = (item: BottomNavItem) => {
    const active = item.key === value;

    // Variant A — extended pill with text (active = horizontal pill, inactive = icon only).
    if (indicator === "pill-text") {
      if (active) {
        return (
          <Pressable
            accessibilityLabel={item.label ?? item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
            className="flex-row items-center px-4 py-2"
            key={item.key}
            onPress={() => onChange(item.key)}
            style={{ borderRadius: 999, backgroundColor: activeTint }}
          >
            {renderIconNode(item, true, onActive)}
            {item.label ? (
              <Typography.Text
                semibold
                style={{ color: onActive, fontSize: 13, marginLeft: 8 }}
              >
                {item.label}
              </Typography.Text>
            ) : null}
          </Pressable>
        );
      }
      return (
        <Pressable
          accessibilityLabel={item.label ?? item.key}
          accessibilityRole="tab"
          className="items-center justify-center px-3 py-2"
          key={item.key}
          onPress={() => onChange(item.key)}
        >
          {renderIconNode(item, false, inactiveColor)}
        </Pressable>
      );
    }

    // Variants none / pill / bar / glow — vertical icon + optional indicator + optional label.
    const inPill = indicator === "pill" && active;
    const iconColor = inPill
      ? onActive
      : active
        ? indicator === "glow"
          ? activeTint
          : activeTint
        : inactiveColor;
    const labelColor = active ? (dark ? "#FFFFFF" : activeTint) : inactiveColor;

    return (
      <Pressable
        accessibilityLabel={item.label ?? item.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        className="flex-1 items-center justify-center py-1.5"
        key={item.key}
        onPress={() => onChange(item.key)}
      >
        {indicator === "bar" && active ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              width: 26,
              height: 3,
              borderRadius: 999,
              backgroundColor: activeTint,
            }}
          />
        ) : null}
        <View
          className={inPill ? "px-5 py-1.5" : undefined}
          style={inPill ? { borderRadius: 999, backgroundColor: activeTint } : undefined}
        >
          {renderIconNode(item, active, iconColor)}
        </View>
        {indicator === "glow" && active ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              marginTop: 4,
              backgroundColor: activeTint,
              shadowColor: activeTint,
              shadowOpacity: 0.9,
              shadowRadius: 5,
              elevation: 4,
            }}
          />
        ) : null}
        {showLabels && item.label && indicator !== "glow" ? (
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
      className="items-center justify-center"
      onPress={centerAction?.onPress}
      style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        marginTop: -20,
        marginHorizontal: 6,
        backgroundColor: activeTint,
        // Glow halo en el color de acento (iOS shadow + Android elevation).
        shadowColor: activeTint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.55,
        shadowRadius: 14,
        elevation: 10,
      }}
    >
      <Icon color={onActive} name={centerAction?.icon ?? "add"} size={26} />
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

  const justify = indicator === "pill-text" ? "justify-around" : "";

  return (
    <View
      className={cn("flex-row items-center", justify, className)}
      style={containerStyle}
      testID={testID}
    >
      {content}
    </View>
  );
}

export default BottomNav;
export { BottomNav };
