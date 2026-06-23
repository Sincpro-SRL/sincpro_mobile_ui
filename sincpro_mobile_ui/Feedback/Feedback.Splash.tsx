import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import Pattern from "@sincpro/mobile-ui/Display/Display.Pattern";
import Loading from "@sincpro/mobile-ui/Feedback/Feedback.Loading";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, type ImageSourcePropType, View } from "react-native";

interface SplashScreenProps {
  isReady: boolean;
  logo?: ImageSourcePropType;
  minDuration?: number;
  message?: string;
  /** `default` keeps the legacy look; `hero` is the modern dark gradient + dotted texture. */
  variant?: "default" | "hero";
  /** Brand name shown under the logo on `hero`. */
  title?: string;
  /** Small caption under the title on `hero` (e.g. "gestión · v2.0"). */
  subtitle?: string;
  children?: ReactNode;
}

function renderLogo(logo?: ImageSourcePropType) {
  if (!logo) {
    return null;
  }
  return <Image className="w-[250px] h-[200px] mb-12" resizeMode="contain" source={logo} />;
}

function HeroSplash({
  logo,
  message,
  title,
  subtitle,
}: {
  logo?: ImageSourcePropType;
  message: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <GradientSurface
      className="flex-1 items-center justify-center"
      preset="night-green"
      radius="none"
    >
      <Pattern color="#22E584" kind="dots" opacity={0.16} size={26} />
      <View className="items-center">
        {logo ? (
          <Image
            className="w-28 h-28 mb-7"
            resizeMode="contain"
            source={logo}
            style={{ shadowColor: "#22E584", shadowOpacity: 0.7, shadowRadius: 28 }}
          />
        ) : null}
        {title ? (
          <Typography.Text bold style={{ color: "#FFFFFF", fontSize: 28, letterSpacing: 1 }}>
            {title}
          </Typography.Text>
        ) : null}
        {subtitle ? (
          <Typography.Text
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}
          >
            {subtitle}
          </Typography.Text>
        ) : null}
        <View className="mt-10">
          <ActivityIndicator accessibilityLabel={message} color="#22E584" size="small" />
        </View>
      </View>
    </GradientSurface>
  );
}

function Splash({
  isReady,
  logo,
  minDuration = 800,
  message = "Inicializando...",
  variant = "default",
  title,
  subtitle,
  children,
}: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const minDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (minDurationTimeoutRef.current) {
      clearTimeout(minDurationTimeoutRef.current);
    }

    if (!isReady) {
      setShowContent(false);
      return;
    }

    minDurationTimeoutRef.current = setTimeout(() => {
      setShowContent(true);
    }, minDuration);

    return () => {
      if (minDurationTimeoutRef.current) {
        clearTimeout(minDurationTimeoutRef.current);
      }
    };
  }, [isReady, minDuration]);

  if (!showContent) {
    if (variant === "hero") {
      return <HeroSplash logo={logo} message={message} subtitle={subtitle} title={title} />;
    }
    return (
      <GradientContainer className="flex-1">
        <View className="flex-1 justify-center items-center">
          {renderLogo(logo)}
          <Loading message={message} size="large" />
        </View>
      </GradientContainer>
    );
  }

  return children;
}

export default Splash;
