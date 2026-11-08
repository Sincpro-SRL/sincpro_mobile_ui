import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { View } from "react-native";

/**
 * The disclosure chevron of every navigational row (`MenuButton`, `ListItem`): the native
 * chevron at the size of the text glyph the menus used, hidden from screen readers
 * because the row already announces itself as a button.
 */
export function Chevron() {
  const theme = useTheme();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Icon color={theme.icon.tertiary} name="next" size={10} />
    </View>
  );
}
