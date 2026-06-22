import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { type ImageSourcePropType, View } from "react-native";

export interface MediaCardProps {
  image: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  overlay?: ReactNode;
  aspectRatio?: number;
  height?: number;
  radius?: number;
  onPress?: () => void;
  className?: string;
  testID?: string;
}

function MediaCard({
  image,
  title,
  subtitle,
  badge,
  overlay,
  aspectRatio = 16 / 9,
  height,
  radius = 16,
  onPress,
  className,
  testID,
}: MediaCardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      accessibilityLabel={title}
      accessibilityRole={onPress ? "button" : undefined}
      className={cn("overflow-hidden", className)}
      onPress={onPress}
      style={{ borderRadius: radius }}
      testID={testID}
    >
      <DisplayImage
        aspectRatio={height ? undefined : aspectRatio}
        height={height}
        radius={radius}
        source={image}
      />
      {badge ? <View className="absolute top-3 left-3">{badge}</View> : null}
      {title || subtitle || overlay ? (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.75)"]}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 12 }}
        >
          {overlay}
          {title ? (
            <Typography.Text
              className="text-white"
              numberOfLines={1}
              semibold
              variant="subtitle"
            >
              {title}
            </Typography.Text>
          ) : null}
          {subtitle ? (
            <Typography.Text className="text-white/80" numberOfLines={1} variant="bodySmall">
              {subtitle}
            </Typography.Text>
          ) : null}
        </LinearGradient>
      ) : null}
    </Wrapper>
  );
}

export default MediaCard;
