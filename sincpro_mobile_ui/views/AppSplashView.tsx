import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { Pattern, type PatternKind } from "@sincpro/mobile-ui/Display/Display.Pattern";
import Spinner, { type SpinnerVariant } from "@sincpro/mobile-ui/Feedback/Feedback.Spinner";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import type { ReactNode } from "react";
import { Image, type ImageSourcePropType, View, type ViewStyle } from "react-native";

export interface AppSplashViewProps {
  /** Gradient + pattern background. Defaults to `night-green` preset. */
  background?: AppBarBackground;
  /** App logo shown centered above the loading indicator. */
  logo?: ImageSourcePropType;
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
          color={background.patternColor ?? "#FFFFFF"}
          kind={background.pattern as PatternKind}
          opacity={background.patternOpacity ?? 0.18}
        />
      ) : null}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {logo ? (
          <Image
            source={logo}
            style={{ width: 140, height: 140, resizeMode: "contain", marginBottom: 40 }}
          />
        ) : null}
        {loader ?? (
          <Spinner color="rgba(255,255,255,0.9)" size="large" variant={loadingVariant} />
        )}
      </View>
    </GradientSurface>
  );
}

export default AppSplashView;
