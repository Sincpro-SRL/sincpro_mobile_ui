import { useTheme } from "@sincpro/mobile-ui/theme/useTheme";
import type { ActivityIndicatorProps } from "react-native";
import { ActivityIndicator as RNActivityIndicator } from "react-native";

interface ThemedActivityIndicatorProps extends Omit<ActivityIndicatorProps, "color"> {
  /** Defaults to the theme `primary`. */
  color?: string;
}

/** ActivityIndicator in the theme `primary` unless a color is given. */
export function ThemedActivityIndicator({ color, ...props }: ThemedActivityIndicatorProps) {
  const theme = useTheme();
  return <RNActivityIndicator color={color ?? theme.primary} {...props} />;
}
