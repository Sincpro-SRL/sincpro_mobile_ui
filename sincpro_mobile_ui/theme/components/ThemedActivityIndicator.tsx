import type { ActivityIndicatorProps } from "react-native";
import { ActivityIndicator as RNActivityIndicator } from "react-native";

/**
 * ============================================================================
 * THEMED ACTIVITY INDICATOR
 * ============================================================================
 *
 * Wrapper de ActivityIndicator que usa color primary.
 * NOTA: Como no podemos usar hooks, usa el color hardcoded de Distribution.
 * Para cambiar color, pasar prop color directamente.
 *
 * USO:
 * ```tsx
 * <ThemedActivityIndicator />
 * <ThemedActivityIndicator size="large" color="#8B5CF6" />
 * ```
 */

interface ThemedActivityIndicatorProps extends Omit<ActivityIndicatorProps, "color"> {
  color?: string;
}

export function ThemedActivityIndicator({
  color = "#0075FF",
  ...props
}: ThemedActivityIndicatorProps) {
  return <RNActivityIndicator color={color} {...props} />;
}
