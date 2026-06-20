import { View, ViewProps } from "react-native";

import { cn } from "../theme/tw";

interface BoxProps extends ViewProps {
  className?: string;
}

function Box({ className, style, ...props }: BoxProps) {
  return <View className={cn(className)} style={style} {...props} />;
}

export default Box;
export { Box };
