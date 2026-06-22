import { cn } from "@sincpro/mobile-ui/theme/tw";
import React, { FC, ReactNode } from "react";
import { StatusBar, ViewStyle } from "react-native";
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
  barStyle = "light-content",
  statusBarHidden = false,
  edges = ["top", "bottom", "left", "right"],
  className,
}) => {
  return (
    <SafeAreaView className={cn("flex-1 bg-bg-page", className)} edges={edges} style={style}>
      {/* Under edge-to-edge only `barStyle` (icon color) applies on Android;
          `backgroundColor`/`translucent` are no-ops and were removed. */}
      <StatusBar barStyle={barStyle} hidden={statusBarHidden} />
      {children}
    </SafeAreaView>
  );
};

export default Container;
