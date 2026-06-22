import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { useState } from "react";
import {
  Image,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  View,
} from "react-native";

export interface DisplayImageProps {
  source: ImageSourcePropType;
  width?: number | `${number}%`;
  height?: number;
  aspectRatio?: number;
  radius?: number;
  resizeMode?: ImageResizeMode;
  fallbackIcon?: string;
  className?: string;
  style?: ImageStyle;
  testID?: string;
}

function DisplayImage({
  source,
  width = "100%",
  height,
  aspectRatio,
  radius = 12,
  resizeMode = "cover",
  fallbackIcon = "image-outline",
  className,
  style,
  testID,
}: DisplayImageProps) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const dimensions = { width, height, aspectRatio, borderRadius: radius } as const;

  return (
    <View
      className={cn("overflow-hidden bg-bg-muted", className)}
      style={dimensions}
      testID={testID}
    >
      {failed ? (
        <View className="flex-1 items-center justify-center">
          <Icon color={theme.icon.disabled} name={fallbackIcon} size={32} />
        </View>
      ) : (
        <>
          <Image
            onError={() => {
              setFailed(true);
              setLoading(false);
            }}
            onLoadEnd={() => setLoading(false)}
            resizeMode={resizeMode}
            source={source}
            style={[{ width: "100%", height: "100%" }, style]}
          />
          {loading ? (
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <Skeleton height="100%" radius={radius} width="100%" />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

export default DisplayImage;
