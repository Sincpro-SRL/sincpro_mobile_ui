import Loading from "@sincpro/mobile-ui/Feedback/Feedback.Loading";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Image, type ImageSourcePropType, View } from "react-native";

interface SplashScreenProps {
  isReady: boolean;
  logo?: ImageSourcePropType;
  minDuration?: number;
  message?: string;
  children?: ReactNode;
}

function renderLogo(logo?: ImageSourcePropType) {
  if (!logo) {
    return null;
  }
  return <Image className="w-[250px] h-[200px] mb-12" resizeMode="contain" source={logo} />;
}

function Splash({
  isReady,
  logo,
  minDuration = 800,
  message = "Inicializando...",
  children,
}: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const minDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
