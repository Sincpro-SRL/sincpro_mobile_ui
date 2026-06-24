import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ComponentType } from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PromoModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  body?: string;
  /** Optional icon rendered at the top of the card. */
  icon?: ComponentType<{ size?: number; color?: string }>;
  /** Gradient for the icon header area (top strip). */
  headerGradient?: readonly [string, string, ...string[]];
  /** Primary CTA label. */
  ctaLabel?: string;
  onPressCta?: () => void;
  /** Secondary link/dismiss label. Defaults to "Ahora no". */
  dismissLabel?: string;
  /** Badge chip text above the title (e.g. "Novedad", "Oferta"). */
  badge?: string;
  /** Accent color for the CTA button and badge. */
  accentColor?: string;
}

/**
 * Bottom-anchored modal for news, promotions, or announcements.
 * Tapping outside (backdrop) also dismisses it.
 *
 * Usage:
 *   <PromoModal
 *     visible={showPromo}
 *     onDismiss={() => setShowPromo(false)}
 *     title="Nueva función disponible"
 *     body="Ahora puedes filtrar rutas por color directamente desde el panel principal."
 *     badge="Novedad"
 *     headerGradient={["#022B14", "#065E2B"]}
 *     icon={BellIcon}
 *     ctaLabel="Explorar"
 *     onPressCta={handleExplore}
 *   />
 */
export function PromoModal({
  visible,
  onDismiss,
  title,
  body,
  icon: Icon,
  headerGradient,
  ctaLabel,
  onPressCta,
  dismissLabel = "Ahora no",
  badge,
  accentColor,
}: PromoModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const accent = accentColor ?? theme.accent;

  return (
    <Modal
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      {/* Backdrop + centering container */}
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: insets.top + 16,
          }}
        />
      </TouchableWithoutFeedback>

      {/* Centered card — absolutely positioned so TouchableWithoutFeedback covers the full backdrop */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: theme.bg.card,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: theme.border.default,
            width: "100%",
            maxWidth: 400,
            overflow: "hidden",
          }}
        >
          {/* Header strip with gradient + icon */}
          {headerGradient || Icon ? (
            <View style={{ height: 120, justifyContent: "center", alignItems: "center" }}>
              {headerGradient ? (
                <GradientSurface
                  colors={headerGradient}
                  padding="none"
                  radius="none"
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                />
              ) : null}
              {Icon ? (
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon color="#FFFFFF" size={32} />
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Content */}
          <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
            {badge ? (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: accent,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  marginBottom: 12,
                }}
              >
                <Typography.Text
                  semibold
                  style={{ color: theme.text.onAccent, fontSize: 11 }}
                  variant="caption"
                >
                  {badge}
                </Typography.Text>
              </View>
            ) : null}

            <Typography.Text semibold style={{ color: theme.text.primary }} variant="h3">
              {title}
            </Typography.Text>

            {body ? (
              <Typography.Text
                style={{ color: theme.text.secondary, marginTop: 8, lineHeight: 22 }}
                variant="body"
              >
                {body}
              </Typography.Text>
            ) : null}
          </View>

          {/* Actions */}
          <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 10 }}>
            {ctaLabel ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onPressCta?.();
                  onDismiss();
                }}
                style={{
                  backgroundColor: accent,
                  borderRadius: 14,
                  paddingVertical: 15,
                  alignItems: "center",
                }}
              >
                <Typography.Text
                  semibold
                  style={{ color: theme.text.onAccent }}
                  variant="body"
                >
                  {ctaLabel}
                </Typography.Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDismiss}
              style={{ alignItems: "center", paddingVertical: 12 }}
            >
              <Typography.Text style={{ color: theme.text.secondary }} variant="body">
                {dismissLabel}
              </Typography.Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
