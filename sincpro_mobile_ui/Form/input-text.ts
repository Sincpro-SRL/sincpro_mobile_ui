import { appliedTextStyle } from "@sincpro/mobile-ui/theme/typography";
import type { TextStyle } from "react-native";

/**
 * What the user types in any DS field: the `body` face and size of the configured fonts.
 * Without it a TextInput falls back to the system font. No line height: on iOS it pushes
 * single-line text off center.
 */
export function inputTextStyle(): TextStyle {
  const { fontFamily, fontSize, fontWeight } = appliedTextStyle("body");
  return { fontFamily, fontSize, fontWeight };
}
