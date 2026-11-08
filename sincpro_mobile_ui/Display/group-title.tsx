import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { StyleProp, TextStyle } from "react-native";

/**
 * The title above a group of rows (`MenuSection`, `ListGroup`, `FormViewV2.Content.Group`,
 * `QuickActions`): the uppercase caption of the settings screens in production. Uppercase
 * comes from `transform`, so screen readers get the original text, announced as a header.
 */
export function GroupTitle({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
}) {
  const theme = useTheme();
  return (
    <Typography.Text
      accessibilityRole="header"
      semibold
      style={[{ color: theme.text.secondary }, style]}
      transform="uppercase"
      variant="caption"
    >
      {children}
    </Typography.Text>
  );
}
