import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { type ImageSourcePropType, View } from "react-native";

export interface MediaEmbedProps {
  thumbnail: ImageSourcePropType;
  onPress: () => void;
  duration?: string;
  title?: string;
  source?: ReactNode;
  aspectRatio?: number;
  className?: string;
  testID?: string;
}

/**
 * Linkable short-video card (Short/TikTok/Reel): thumbnail + play + duration.
 * Opens the content on press (onPress). True inline embedding needs WebView (optional
 * peer) — this is the lightweight/portable piece; wrap it with your player if needed.
 */
function MediaEmbed({
  thumbnail,
  onPress,
  duration,
  title,
  source,
  aspectRatio = 9 / 16,
  className,
  testID,
}: MediaEmbedProps) {
  return (
    <Pressable
      accessibilityLabel={title ?? "Reproducir video"}
      accessibilityRole="button"
      className={cn("overflow-hidden rounded-xl", className)}
      onPress={onPress}
      testID={testID}
    >
      <DisplayImage aspectRatio={aspectRatio} radius={12} source={thumbnail} />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(0,0,0,0.55)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon color={theme.text.inverse} name="play" size={22} />
        </View>
      </View>
      {duration ? (
        <View
          className="rounded"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.7)",
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <Typography.Text className="text-white" variant="caption">
            {duration}
          </Typography.Text>
        </View>
      ) : null}
      {source ? (
        <View style={{ position: "absolute", top: 8, left: 8 }}>{source}</View>
      ) : null}
      {title ? (
        <View style={{ position: "absolute", left: 8, right: 8, bottom: 8 }}>
          <Typography.Text className="text-white" numberOfLines={2} variant="bodySmall">
            {title}
          </Typography.Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default MediaEmbed;
