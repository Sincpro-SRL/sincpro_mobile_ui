import ScreenStatusBar from "@sincpro/mobile-ui/layouts/ScreenStatusBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import React, { FC, ReactNode } from "react";
import { ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  /** @deprecated Ignored under edge-to-edge (SDK 54+): the status bar is always translucent. */
  statusBarColor?: string;
  barStyle?: "light-content" | "dark-content";
  statusBarHidden?: boolean;
  edges?: Edge[];
  className?: string;
};

const Container: FC<ContainerProps> = ({
  children,
  style,
  barStyle,
  statusBarHidden,
  edges = ["top", "bottom", "left", "right"],
  className,
}) => {
  const theme = useTheme();
  const ownsStatusBar =
    edges.includes("top") || barStyle !== undefined || statusBarHidden !== undefined;

  return (
    <SafeAreaView className={cn("flex-1 bg-bg-page", className)} edges={edges} style={style}>
      {/* Under edge-to-edge only `barStyle` (icon color) applies on Android;
          `backgroundColor`/`translucent` are no-ops and were removed. */}
      {ownsStatusBar ? (
        <ScreenStatusBar
          backgroundColor={theme.bg.page}
          barStyle={barStyle}
          hidden={statusBarHidden}
        />
      ) : null}
      {children}
    </SafeAreaView>
  );
};

export default Container;
