import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { ON_DARK_SURFACE } from "@sincpro/mobile-ui/theme/on-dark-surface";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Modal, Pressable as RNPressable, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface StoryViewerSlide {
  image: ImageSource;
}

export interface StoryViewerProps {
  visible: boolean;
  slides: StoryViewerSlide[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  title: string;
  subtitle?: string;
  time?: string;
  avatar?: ImageSource;
  progress?: number;
  muted?: boolean;
  paused?: boolean;
  onToggleMute?: () => void;
  onTogglePause?: () => void;
  onMore?: () => void;
  footer?: ReactNode;
  testID?: string;
}

function StoryViewer({
  visible,
  slides,
  index,
  onIndexChange,
  onClose,
  title,
  subtitle,
  time,
  avatar,
  progress = 1,
  muted,
  paused,
  onToggleMute,
  onTogglePause,
  onMore,
  footer,
  testID,
}: StoryViewerProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const current = slides[index];

  const goPrev = () => {
    if (index > 0) onIndexChange(index - 1);
  };
  const goNext = () => {
    if (index < slides.length - 1) onIndexChange(index + 1);
    else onClose();
  };

  if (!current) return null;

  return (
    <Modal
      animationType={reducedMotion ? "none" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
      transparent={false}
      visible={visible}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }} testID={testID}>
        <ExpoImage
          contentFit="contain"
          source={current.image}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Tap zones: izquierda = anterior, derecha = siguiente */}
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
          }}
        >
          <RNPressable onPress={goPrev} style={{ width: "33%" }} />
          <RNPressable onPress={goNext} style={{ flex: 1 }} />
        </View>

        {/* Top: barras de progreso + header */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top + 8,
            paddingLeft: insets.left + 10,
            paddingRight: insets.right + 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 4 }}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 2.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.35)",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width:
                      i < index
                        ? "100%"
                        : i === index
                          ? `${Math.round(progress * 100)}%`
                          : "0%",
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            {avatar ? (
              <ExpoImage
                source={avatar}
                style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Typography.Text className="text-white" semibold variant="body">
                  {title}
                </Typography.Text>
                {time ? (
                  <Typography.Text style={{ color: ON_DARK_SURFACE.muted }} variant="caption">
                    {time}
                  </Typography.Text>
                ) : null}
              </View>
              {subtitle ? (
                <Typography.Text
                  numberOfLines={1}
                  style={{ color: ON_DARK_SURFACE.muted }}
                  variant="caption"
                >
                  {subtitle}
                </Typography.Text>
              ) : null}
            </View>

            {onToggleMute ? (
              <Pressable
                accessibilityLabel={muted ? "Activar sonido" : "Silenciar"}
                hitSlop={8}
                onPress={onToggleMute}
              >
                <Icon
                  color={ON_DARK_SURFACE.ink}
                  name={muted ? "mute" : "volume"}
                  size={22}
                />
              </Pressable>
            ) : null}
            {onTogglePause ? (
              <Pressable
                accessibilityLabel={paused ? "Reanudar" : "Pausar"}
                hitSlop={8}
                onPress={onTogglePause}
                style={{ marginLeft: 14 }}
              >
                <Icon
                  color={ON_DARK_SURFACE.ink}
                  name={paused ? "play" : "pause"}
                  size={22}
                />
              </Pressable>
            ) : null}
            {onMore ? (
              <Pressable
                accessibilityLabel="Más opciones"
                hitSlop={8}
                onPress={onMore}
                style={{ marginLeft: 14 }}
              >
                <Icon color={ON_DARK_SURFACE.ink} name="more" size={22} />
              </Pressable>
            ) : null}
            <Pressable
              accessibilityLabel="Cerrar"
              hitSlop={8}
              onPress={onClose}
              style={{ marginLeft: 14 }}
            >
              <Icon color={ON_DARK_SURFACE.ink} name="close" size={24} />
            </Pressable>
          </View>
        </LinearGradient>

        {/* Botón siguiente (chevron) */}
        {index < slides.length - 1 ? (
          <Pressable
            accessibilityLabel="Siguiente"
            onPress={goNext}
            style={{
              position: "absolute",
              right: insets.right + 8,
              top: "50%",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon color={theme.text.primary} name="next" size={22} />
          </Pressable>
        ) : null}

        {/* Footer */}
        {footer ? (
          <KeyboardStickyView
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              paddingBottom: insets.bottom + 8,
              paddingLeft: insets.left + 16,
              paddingRight: insets.right + 16,
            }}
          >
            {footer}
          </KeyboardStickyView>
        ) : null}
      </View>
    </Modal>
  );
}

export default StoryViewer;
