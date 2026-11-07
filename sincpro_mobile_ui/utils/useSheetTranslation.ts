import { useReducedMotion } from "@sincpro/mobile-ui/utils/useReducedMotion";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

export function useSheetTranslation(visible: boolean, hiddenOffset = 800) {
  const reducedMotion = useReducedMotion();
  const [translateY] = useState(() => new Animated.Value(visible ? 0 : hiddenOffset));

  useEffect(() => {
    translateY.stopAnimation();
    if (visible && !reducedMotion) {
      const animation = Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      });
      animation.start();
      return () => animation.stop();
    }
    translateY.setValue(visible ? 0 : hiddenOffset);
    return () => translateY.stopAnimation();
  }, [visible, hiddenOffset, reducedMotion, translateY]);

  return { translateY, reducedMotion };
}
