import ExpoImage from "@sincpro/mobile-ui/Display/Display.ExpoImage";
import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { Pattern, type PatternKind } from "@sincpro/mobile-ui/Display/Display.Pattern";
import Spinner, { type SpinnerVariant } from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { ON_DARK_SURFACE } from "@sincpro/mobile-ui/theme/on-dark-surface";
import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import type { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

export interface AppSplashViewProps {
  /** Gradient + pattern background. Defaults to `night-green` preset. */
  background?: AppBarBackground;
  /** App logo shown centered above the loading indicator. */
  logo?: ImageSource;
  /** Built-in loading animation variant. Ignored when `loader` is provided. Defaults to `"dots"`. */
  loadingVariant?: SpinnerVariant;
  /** Fully custom loading element. Takes precedence over `loadingVariant`. */
  loader?: ReactNode;
  /** Override the outer container style. */
  style?: ViewStyle;
}

export function AppSplashView({
  background,
  logo,
  loadingVariant = "dots",
  loader,
  style,
}: AppSplashViewProps) {
  return (
    <GradientSurface
      className="flex-1"
      colors={background?.colors}
      end={background?.end}
      padding="none"
      preset={background?.surface ?? "night-green"}
      radius="none"
      start={background?.start}
      style={{ flex: 1, ...style }}
    >
      {background?.pattern ? (
        <Pattern
          color={background.patternColor ?? ON_DARK_SURFACE.ink}
          kind={background.pattern as PatternKind}
          opacity={background.patternOpacity ?? 0.18}
        />
      ) : null}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {logo ? (
          <ExpoImage
            contentFit="contain"
            source={logo}
            style={{ width: 140, height: 140, marginBottom: 40 }}
          />
        ) : null}
        {loader ?? (
          <Spinner color={ON_DARK_SURFACE.ink} size="large" variant={loadingVariant} />
        )}
      </View>
    </GradientSurface>
  );
}

export default AppSplashView;
