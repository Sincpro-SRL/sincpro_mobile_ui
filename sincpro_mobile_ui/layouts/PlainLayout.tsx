import { memo, ReactNode } from "react";
import { View } from "react-native";

interface PlainLayoutProps {
  children?: ReactNode;
}

const PlainLayout = memo(({ children }: PlainLayoutProps) => {
  return <View className="flex-1">{children}</View>;
});

PlainLayout.displayName = "PlainLayout";

export default PlainLayout;
