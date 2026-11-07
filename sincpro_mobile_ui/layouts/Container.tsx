import { cn } from "@sincpro/mobile-ui/theme/tw";
import React, { FC, ReactNode } from "react";
import { ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

type ContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  className?: string;
};

const Container: FC<ContainerProps> = ({
  children,
  style,
  edges = ["left", "right"],
  className,
}) => {
  return (
    <SafeAreaView className={cn("flex-1 bg-bg-page", className)} edges={edges} style={style}>
      {children}
    </SafeAreaView>
  );
};

export default Container;
