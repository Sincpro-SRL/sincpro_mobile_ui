import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import { StatusBar } from "react-native";

type ScreenStatusBarProps = {
  backgroundColor: string;
  barStyle?: "light-content" | "dark-content";
  hidden?: boolean;
};

function ScreenStatusBar({
  backgroundColor,
  barStyle,
  hidden = false,
}: ScreenStatusBarProps) {
  const resolvedStyle =
    barStyle ??
    (resolveOnColor(backgroundColor, { light: "#FFFFFF", dark: "#000000" }) === "#FFFFFF"
      ? "light-content"
      : "dark-content");

  return <StatusBar barStyle={resolvedStyle} hidden={hidden} />;
}

export default ScreenStatusBar;
