import React, { FC, ReactNode } from "react";
import { StatusBar, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../theme";
import { cn } from "../theme/tw";

type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  statusBarColor?: string;
  barStyle?: "light-content" | "dark-content";
  statusBarHidden?: boolean;
  edges?: Edge[];
  className?: string;
};

const Container: FC<ContainerProps> = ({
  children,
  style,
  statusBarColor = theme.primary,
  barStyle = "light-content",
  statusBarHidden = false,
  edges = ["top", "bottom", "left", "right"],
  className,
}) => {
  return (
    <SafeAreaView className={cn("flex-1 bg-bg-page", className)} edges={edges} style={style}>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={barStyle}
        hidden={statusBarHidden}
        translucent={false}
      />
      {children}
    </SafeAreaView>
  );
};

export default Container;
