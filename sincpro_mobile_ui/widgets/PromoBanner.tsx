import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export interface PromoBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Left accent icon. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  /** Gradient color stops for the card surface. */
  gradient?: readonly [string, string, ...string[]];
  /** Accent color for the CTA button and badge. Defaults to `theme.accent`. */
  accentColor?: string;
  ctaLabel?: string;
  onPress?: () => void;
  /** Small badge text (e.g. "Nuevo", "Promo"). */
  badge?: string;
}

export interface PromoBannerProps {
  items: PromoBannerItem[];
  /** Section heading above the banners row. */
  title?: string;
}

function BannerCard({ item }: { item: PromoBannerItem }) {
  const theme = useTheme();
  const accent = item.accentColor ?? theme.accent;
  const hasGradient = !!item.gradient;
  const Icon = item.icon;

  const textColor = hasGradient ? "#FFFFFF" : theme.text.primary;
  const subtextColor = hasGradient ? "rgba(255,255,255,0.75)" : theme.text.secondary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={item.onPress}
      style={{
        width: 280,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: hasGradient ? "transparent" : theme.bg.card,
        borderWidth: hasGradient ? 0 : 1,
        borderColor: theme.border.default,
        ...theme.shadow.md,
      }}
    >
      {hasGradient ? (
        <GradientSurface
          colors={item.gradient!}
          padding="none"
          radius="none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : null}

      <View style={{ padding: 16 }}>
        {/* Badge */}
        {item.badge ? (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: accent,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 3,
              marginBottom: 10,
            }}
          >
            <Typography.Text
              semibold
              style={{ color: "#FFFFFF", fontSize: 11 }}
              variant="caption"
            >
              {item.badge}
            </Typography.Text>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Left icon */}
          {Icon ? (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: hasGradient ? "rgba(255,255,255,0.15)" : theme.bg.muted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon color={hasGradient ? "#FFFFFF" : theme.icon.primary} size={24} />
            </View>
          ) : null}

          {/* Text */}
          <View style={{ flex: 1 }}>
            <Typography.Text semibold style={{ color: textColor }} variant="subtitle">
              {item.title}
            </Typography.Text>
            {item.subtitle ? (
              <Typography.Text
                style={{ color: subtextColor, marginTop: 2 }}
                variant="bodySmall"
              >
                {item.subtitle}
              </Typography.Text>
            ) : null}
          </View>
        </View>

        {/* CTA */}
        {item.ctaLabel ? (
          <View
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              backgroundColor: hasGradient ? "rgba(255,255,255,0.2)" : accent,
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 7,
            }}
          >
            <Typography.Text
              semibold
              style={{ color: hasGradient ? "#FFFFFF" : theme.text.onAccent, fontSize: 13 }}
              variant="bodySmall"
            >
              {item.ctaLabel}
            </Typography.Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

/**
 * Horizontal scrollable row of promotional/announcement cards.
 * Each card supports gradient surfaces, icon, badge, title, subtitle, and a CTA button.
 *
 * Usage:
 *   <PromoBanner
 *     title="Destacados"
 *     items={[
 *       { id: "1", title: "Nueva ruta", subtitle: "Servicio express", badge: "Nuevo",
 *         gradient: ["#0D2B1F", "#00C357"], ctaLabel: "Ver más", onPress: ... },
 *     ]}
 *   />
 */
export function PromoBanner({ items, title }: PromoBannerProps) {
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 2 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => (
          <BannerCard item={item} key={item.id} />
        ))}
      </ScrollView>
    </View>
  );
}
