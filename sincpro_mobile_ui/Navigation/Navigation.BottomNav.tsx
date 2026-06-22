import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface BottomNavItem {
  key: string;
  label?: string;
  icon: string;
  activeIcon?: string;
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
  showLabels?: boolean;
  centerAction?: BottomNavCenterAction;
  /** Reserva el espacio inferior (insets.bottom). `false` al embeber en FloatingBar. */
  safeArea?: boolean;
  className?: string;
  testID?: string;
}

/**
 * Bottom navigation flat y moderna: superficie tokenizada + hairline superior, activo en
 * `primary`. `centerAction` agrega un FAB central elevado (estilo apps de delivery/social).
 */
function BottomNav({
  items,
  value,
  onChange,
  showLabels = true,
  centerAction,
  safeArea = true,
  className,
  testID,
}: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = safeArea ? insets.bottom : 0;

  const renderItem = (item: BottomNavItem) => {
    const active = item.key === value;
    const color = active ? theme.primary : theme.icon.secondary;
    return (
      <Pressable
        accessibilityLabel={item.label ?? item.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        className="flex-1 items-center justify-center py-1.5"
        key={item.key}
        onPress={() => onChange(item.key)}
      >
        <View>
          <Icon
            color={color}
            name={active ? (item.activeIcon ?? item.icon) : item.icon}
            size={24}
          />
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
          <Typography.Text numberOfLines={1} style={{ color, fontSize: 11, marginTop: 3 }}>
            {item.label}
          </Typography.Text>
        ) : null}
      </Pressable>
    );
  };

  if (centerAction) {
    const mid = Math.ceil(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);
    return (
      <View
        className={cn(
          "flex-row items-center bg-bg-card border-t border-border-light",
          className,
        )}
        style={{ paddingBottom: bottomPad, minHeight: 56 }}
        testID={testID}
      >
        {left.map(renderItem)}
        <Pressable
          accessibilityLabel={centerAction.accessibilityLabel ?? "Acción"}
          accessibilityRole="button"
          className="items-center justify-center bg-primary rounded-full"
          onPress={centerAction.onPress}
          style={{
            width: 52,
            height: 52,
            marginTop: -20,
            marginHorizontal: 6,
            ...theme.shadow.md,
          }}
        >
          <Icon color={theme.icon.inverse} name={centerAction.icon} size={26} />
        </Pressable>
        {right.map(renderItem)}
      </View>
    );
  }

  return (
    <View
      className={cn("flex-row bg-bg-card border-t border-border-light", className)}
      style={{ paddingBottom: bottomPad, minHeight: 56 }}
      testID={testID}
    >
      {items.map(renderItem)}
    </View>
  );
}

export default BottomNav;
