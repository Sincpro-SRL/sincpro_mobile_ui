import type { IconName } from "@sincpro/mobile-ui/Display";
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
  fallbackIcon?: IconName;
  className?: string;
  style?: ExpoImageProps["style"];
  containerStyle?: StyleProp<ViewStyle>;
  renderError?: (retry: () => void) => ReactNode;
  testID?: string;
}

interface LoadState {
  key: string | undefined;
  attempt: number;
  loading: boolean;
  failed: boolean;
}

const fresh = (key: string | undefined): LoadState => ({
  key,
  attempt: 0,
  loading: true,
  failed: false,
});

/**
 * One native image view for the life of the component. A new `source` resets the load
 * state in place instead of remounting, so a recycled FlashList cell keeps its view and
 * `recyclingKey` clears the previous picture natively. Each load has a token; events
 * from an older source or attempt cannot settle the current one.
 */
function DisplayImage({
  source,
  width = "100%",
  height,
  aspectRatio,
  radius = 12,
  contentFit = "cover",
  placeholder,
  fallbackIcon = "image",
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
  ...imageProps
}: DisplayImageProps) {
  const theme = useTheme();
  const sourceKey = imageSourceKey(source);
  const [state, setState] = useState<LoadState>(() => fresh(sourceKey));
  let current = state;
  if (state.key !== sourceKey) {
    current = fresh(sourceKey);
    setState(current);
  }
  const token = `${current.attempt}:${current.key}`;
  const committed = useRef<string | null>(null);

  useLayoutEffect(() => {
    committed.current = token;
  });
  useLayoutEffect(
    () => () => {
      committed.current = null;
    },
    [],
  );

  /** Applies a change only while this render's load is still the current one. */
  const settle = (patch: Partial<LoadState>) => {
    if (committed.current !== token) return false;
    setState((previous) => ({ ...previous, ...patch }));
    return true;
  };
  const retry = () =>
    setState((previous) => ({
      ...previous,
      attempt: previous.attempt + 1,
      loading: true,
      failed: false,
    }));

  const dimensions = { width, height, aspectRatio, borderRadius: radius } as const;

  return (
    <View
      className={cn("overflow-hidden bg-bg-muted", className)}
      style={[dimensions, containerStyle]}
      testID={testID}
    >
      {current.failed ? (
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
            // Only a manual retry asks the native view to start over.
            key={current.attempt}
            onError={(event) => {
              if (settle({ failed: true, loading: false })) onError?.(event);
            }}
            onLoad={(event) => {
              if (settle({ loading: false })) onLoad?.(event);
            }}
            onLoadEnd={() => {
              if (settle({ loading: false })) onLoadEnd?.();
            }}
            onLoadStart={() => {
              if (settle({ loading: true })) onLoadStart?.();
            }}
            placeholder={placeholder}
            placeholderContentFit={imageProps.placeholderContentFit ?? contentFit}
            source={source}
            style={[{ width: "100%", height: "100%" }, style]}
          />
          {current.loading && !placeholder ? (
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
