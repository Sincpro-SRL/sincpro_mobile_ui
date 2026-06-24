import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export interface QuickActionItem {
  id: string;
  label: string;
  /** Ionicon name — use this OR `customIcon`. */
  icon?: string;
  customIcon?: ComponentType<{ size?: number; color?: string }>;
  badge?: string | number;
  onPress?: () => void;
  /** Circle background color override. Defaults to `theme.bg.muted`. */
  color?: string;
}

export interface QuickActionsProps {
  items: QuickActionItem[];
  /** Section heading rendered above the row. */
  title?: string;
}

/**
 * Horizontal scrollable row of small icon+label shortcuts ("Acciones Rápidas").
 * Each item renders a 48 px icon circle + optional badge + label below.
 * Scroll is horizontal and indicator-free for a clean look.
 */
export function QuickActions({ items, title }: QuickActionsProps) {
  const theme = useTheme();

  return (
    <View>
      {title ? (
        <Typography.Text
          semibold
          style={{ color: theme.text.secondary, marginBottom: 10, paddingHorizontal: 16 }}
          variant="caption"
        >
          {title.toUpperCase()}
        </Typography.Text>
      ) : null}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 12, gap: 4 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item.id}
            onPress={item.onPress}
            style={{ alignItems: "center", width: 72, paddingVertical: 4 }}
          >
            {/* Icon circle */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                backgroundColor: item.color ?? theme.bg.muted,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: theme.border.default,
              }}
            >
              <Icon
                color={theme.text.primary}
                customIcon={item.customIcon}
                name={item.icon}
                size={24}
                type={item.customIcon ? "custom" : "ionicons"}
              />
            </View>

            {/* Badge */}
            {item.badge != null ? (
              <View
                style={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  backgroundColor: theme.danger,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 4,
                  borderWidth: 2,
                  borderColor: theme.bg.card,
                }}
              >
                <Typography.Text style={{ color: "#FFFFFF", fontSize: 9, lineHeight: 11 }}>
                  {item.badge}
                </Typography.Text>
              </View>
            ) : null}

            {/* Label */}
            <Typography.Text
              numberOfLines={2}
              style={{
                color: theme.text.primary,
                marginTop: 6,
                textAlign: "center",
                fontSize: 11,
              }}
              variant="caption"
            >
              {item.label}
            </Typography.Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
