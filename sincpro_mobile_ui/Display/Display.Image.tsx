import ExpoImage, { type ExpoImageProps } from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Skeleton from "@sincpro/mobile-ui/Feedback/Feedback.Skeleton";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { type ImageSource, imageSourceKey } from "@sincpro/mobile-ui/utils/image";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

export interface DisplayImageProps extends Omit<ExpoImageProps, "source" | "style"> {
  source: ImageSource;
  width?: number | `${number}%`;
  height?: number;
  aspectRatio?: number;
  radius?: number;
  fallbackIcon?: string;
  className?: string;
  style?: ExpoImageProps["style"];
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
  contentFit = "cover",
  placeholder,
  fallbackIcon = "image-outline",
  className,
  style,
  containerStyle,
  renderError,
  testID,
  onError,
  onLoadStart,
  onLoadEnd,
  onLoad,
  accessibilityLabel,
  accessible,
  retry,
  ...imageProps
}: DisplayImageProps & { retry: () => void }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const active = useRef(true);

  useLayoutEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

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
          <ExpoImage
            {...imageProps}
            accessibilityLabel={accessibilityLabel}
            accessible={accessible}
            contentFit={contentFit}
            onError={(event) => {
              if (!active.current) return;
              setFailed(true);
              setLoading(false);
              onError?.(event);
            }}
            onLoad={(event) => {
              if (!active.current) return;
              setLoading(false);
              onLoad?.(event);
            }}
            onLoadEnd={() => {
              if (!active.current) return;
              setLoading(false);
              onLoadEnd?.();
            }}
            onLoadStart={() => {
              if (!active.current) return;
              setLoading(true);
              onLoadStart?.();
            }}
            placeholder={placeholder}
            placeholderContentFit={imageProps.placeholderContentFit ?? contentFit}
            source={source}
            style={[{ width: "100%", height: "100%" }, style]}
          />
          {loading && !placeholder ? (
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
  const [attempt, setAttempt] = useState(0);
  return (
    <ImageContent
      {...props}
      key={`${imageSourceKey(props.source)}:${attempt}`}
      retry={() => setAttempt((current) => current + 1)}
    />
  );
}

export default DisplayImage;
