import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { type ReactNode, useState } from "react";
import {
  Image,
  type ImageProps,
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";

export interface DisplayImageProps extends Omit<
  ImageProps,
  "source" | "style" | "width" | "height" | "resizeMode"
> {
  source: ImageSourcePropType;
  width?: number | `${number}%`;
  height?: number;
  aspectRatio?: number;
  radius?: number;
  resizeMode?: ImageResizeMode;
  fallbackIcon?: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  renderError?: (retry: () => void) => ReactNode;
  testID?: string;
}

function ImageContent({
  source,
  width = "100%",
  height,
  aspectRatio,
  radius = 12,
  resizeMode = "cover",
  fallbackIcon = "image-outline",
  className,
  style,
  containerStyle,
  renderError,
  testID,
  onError,
  onLoadStart,
  onLoadEnd,
  accessibilityLabel,
  accessible,
  ...imageProps
}: DisplayImageProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    setFailed(false);
    setLoading(true);
    setAttempt((current) => current + 1);
  };

  const dimensions = { width, height, aspectRatio, borderRadius: radius } as const;

  return (
    <View
      className={cn("overflow-hidden bg-bg-muted", className)}
      style={[dimensions, containerStyle]}
      testID={testID}
    >
      {failed ? (
        renderError ? (
          renderError(retry)
        ) : (
          <View
            accessibilityLabel={
              accessibilityLabel ? `${accessibilityLabel}. Imagen no disponible` : undefined
            }
            accessibilityRole="image"
            accessible={accessible ?? !!accessibilityLabel}
            className="flex-1 items-center justify-center"
          >
            <Icon color={theme.icon.disabled} name={fallbackIcon} size={32} />
          </View>
        )
      ) : (
        <>
          <Image
            {...imageProps}
            accessibilityLabel={accessibilityLabel}
            accessible={accessible}
            key={attempt}
            onError={(event) => {
              setFailed(true);
              setLoading(false);
              console.error("[Display.Image] Image load failed", event.nativeEvent.error);
              onError?.(event);
            }}
            onLoadEnd={() => {
              setLoading(false);
              onLoadEnd?.();
            }}
            onLoadStart={() => {
              setLoading(true);
              onLoadStart?.();
            }}
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

function DisplayImage(props: DisplayImageProps) {
  return <ImageContent {...props} key={JSON.stringify(props.source)} />;
}

export default DisplayImage;
