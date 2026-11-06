import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let active = true;
    let receivedChange = false;
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        receivedChange = true;
        setReducedMotion(enabled);
      },
    );

    AccessibilityInfo.isReduceMotionEnabled().then(
      (enabled) => {
        if (active && !receivedChange) setReducedMotion(enabled);
      },
      (error) => {
        if (active)
          console.warn("[useReducedMotion] Could not read accessibility preference", error);
      },
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
