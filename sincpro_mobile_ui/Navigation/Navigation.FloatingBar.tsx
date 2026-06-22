import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface FloatingBarProps {
  children: ReactNode;
  position?: "top" | "bottom";
  inset?: number;
  className?: string;
  testID?: string;
}

/**
 * **Rounded floating container** for nav/action bars that float above the content
 * (Snapchat/TikTok/McDonald's 2026 style). Shadowed pill, safe-area aware.
 * Presentational: drop a `BottomNav`, actions, or anything inside.
 */
function FloatingBar({
  children,
  position = "bottom",
  inset = 16,
  className,
  testID,
}: FloatingBarProps) {
  const insets = useSafeAreaInsets();
  const safe = position === "bottom" ? insets.bottom : insets.top;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: inset,
        right: inset,
        [position]: safe + inset,
      }}
      testID={testID}
    >
      <View
        className={cn(
          "rounded-full bg-bg-card px-2 py-1.5 border border-border-light",
          className,
        )}
        style={theme.shadow.lg}
      >
        {children}
      </View>
    </View>
  );
}

export default FloatingBar;
