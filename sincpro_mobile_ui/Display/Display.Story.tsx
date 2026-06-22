import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { LinearGradient } from "expo-linear-gradient";
import { Image, type ImageSourcePropType, View } from "react-native";

export interface StoryProps {
  image: ImageSourcePropType;
  label?: string;
  seen?: boolean;
  variant?: "circle" | "card";
  size?: number;
  avatar?: ImageSourcePropType;
  /** Mostrar el círculo del autor en la card. `false` = card de historia sin avatar. */
  showAvatar?: boolean;
  onPress?: () => void;
  testID?: string;
}

const RING: readonly [string, string] = ["#F58529", "#DD2A7B"];

function Story({
  image,
  label,
  seen = false,
  variant = "circle",
  size = 68,
  avatar,
  showAvatar = true,
  onPress,
  testID,
}: StoryProps) {
  if (variant === "card") {
    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        onPress={onPress}
        style={{ width: size * 1.6, borderRadius: 14, overflow: "hidden" }}
        testID={testID}
      >
        <Image source={image} style={{ width: "100%", height: size * 2.6 }} />
        {showAvatar ? (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              borderRadius: 999,
              borderWidth: 3,
              borderColor: seen ? theme.border.strong : theme.primary,
            }}
          >
            <Image
              source={avatar ?? image}
              style={{ width: 34, height: 34, borderRadius: 17 }}
            />
          </View>
        ) : null}
        {label ? (
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: 8,
              paddingTop: 24,
            }}
          >
            <Typography.Text
              className="text-white"
              numberOfLines={2}
              semibold
              variant="caption"
            >
              {label}
            </Typography.Text>
          </LinearGradient>
        ) : null}
      </Pressable>
    );
  }

  const ringPadding = 3;
  const innerSize = size - ringPadding * 2 - 4;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={{ alignItems: "center", width: size + 8, gap: 4 }}
      testID={testID}
    >
      <LinearGradient
        colors={seen ? [theme.border.strong, theme.border.strong] : RING}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: innerSize + 4,
            height: innerSize + 4,
            borderRadius: (innerSize + 4) / 2,
            backgroundColor: theme.bg.card,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={image}
            style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
          />
        </View>
      </LinearGradient>
      {label ? (
        <Typography.Text
          className="text-text-secondary"
          numberOfLines={1}
          style={{ maxWidth: size + 6 }}
          variant="caption"
        >
          {label}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}

export default Story;
