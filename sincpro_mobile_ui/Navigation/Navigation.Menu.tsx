import { type MenuAction, MenuView } from "@expo/ui/community/menu";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { ICON_MAP, type IconName } from "@sincpro/mobile-ui/Display/icon-map";
import { relativeLuminance, useTheme } from "@sincpro/mobile-ui/theme";
import { unstable_getMaterialSymbolSourceAsync } from "expo-symbols";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  type ImageSourcePropType,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

export type MenuItem = {
  label: string;
  icon?: IconName;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
};

export type MenuSeparator = {
  separator: true;
};

export type MenuEntry = MenuItem | MenuSeparator;

export type MenuProps = {
  items: readonly MenuEntry[];
  trigger?: ReactNode;
  title?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function Menu({
  items,
  trigger,
  title,
  disabled = false,
  accessibilityLabel = "Más opciones",
  style,
  testID,
}: MenuProps) {
  const theme = useTheme();
  const running = useRef(false);
  const [pending, setPending] = useState(false);
  const blocked = disabled || pending || !items.some((entry) => !("separator" in entry));
  const [sources, setSources] = useState<Map<string, ImageSourcePropType>>(() => new Map());
  const requests = useMemo(
    () =>
      items.flatMap((entry) =>
        "separator" in entry || !entry.icon
          ? []
          : [
              {
                icon: entry.icon,
                color: entry.destructive ? theme.danger : theme.icon.secondary,
              },
            ],
      ),
    [items, theme.danger, theme.icon.secondary],
  );

  useEffect(() => {
    if (Platform.OS !== "android" || !requests.length) return;
    let active = true;
    void Promise.all(
      requests.map(async ({ icon, color }) => ({
        key: `${icon}:${color}`,
        source: await unstable_getMaterialSymbolSourceAsync(ICON_MAP[icon].md, 24, color),
      })),
    ).then(
      (results) => {
        if (!active) return;
        const next = new Map<string, ImageSourcePropType>();
        for (const { key, source } of results) {
          if (source) next.set(key, source);
        }
        setSources(next);
      },
      (cause: unknown) => {
        console.error("[Navigation.Menu] Could not render native icons", cause);
      },
    );
    return () => {
      active = false;
    };
  }, [requests]);

  const groups: MenuAction[][] = [[]];
  items.forEach((entry, index) => {
    if ("separator" in entry) {
      if (groups[groups.length - 1].length) groups.push([]);
      return;
    }
    const color = entry.disabled
      ? theme.text.disabled
      : entry.destructive
        ? theme.danger
        : theme.text.primary;
    const imageColor = entry.destructive ? theme.danger : theme.icon.secondary;
    groups[groups.length - 1].push({
      id: String(index),
      title: entry.label,
      titleColor: color,
      image: entry.icon
        ? Platform.OS === "ios"
          ? ICON_MAP[entry.icon].sf
          : sources.get(`${entry.icon}:${imageColor}`)
        : undefined,
      imageColor,
      attributes: { disabled: blocked || entry.disabled, destructive: entry.destructive },
    });
  });
  const sections = groups.filter((group) => group.length > 0);
  const actions: MenuAction[] =
    sections.length > 1
      ? sections.map((subactions, index) => ({
          id: `section-${index}`,
          title: "",
          displayInline: true,
          subactions,
        }))
      : (sections[0] ?? []);

  return (
    <View pointerEvents={blocked ? "none" : "auto"} style={style} testID={testID}>
      <MenuView
        actions={actions}
        colorScheme={relativeLuminance(theme.bg.card) < 0.179 ? "dark" : "light"}
        onPressAction={({ nativeEvent }) => {
          const entry = items.find((_, index) => String(index) === nativeEvent.event);
          if (!entry || "separator" in entry || blocked || entry.disabled || running.current)
            return;
          running.current = true;
          setPending(true);
          void Promise.resolve()
            .then(() => entry.onPress())
            .catch((cause: unknown) => {
              Alert.alert(
                "No se pudo completar la acción",
                cause instanceof Error && cause.message.trim()
                  ? cause.message
                  : "Vuelve a intentarlo.",
              );
            })
            .finally(() => {
              running.current = false;
              setPending(false);
            });
        }}
        style={{ minWidth: 48, minHeight: 48 }}
        testID={testID ? `${testID}-native-menu` : undefined}
        title={title}
      >
        <View
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: blocked, busy: pending }}
          accessible
          pointerEvents="none"
          style={{
            minWidth: 48,
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
            opacity: blocked ? 0.5 : 1,
          }}
        >
          {pending ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            (trigger ?? <Icon color={theme.icon.secondary} name="more-vertical" size={22} />)
          )}
        </View>
      </MenuView>
    </View>
  );
}

export default Menu;
export { Menu };
