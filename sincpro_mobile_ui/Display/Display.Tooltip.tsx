import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { View } from "react-native";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  width?: number;
  testID?: string;
}

function resolvePosition(placement: "top" | "bottom" | "left" | "right") {
  switch (placement) {
    case "bottom":
      return { top: "100%" as const, left: 0, marginVertical: 6 };
    case "left":
      return { right: "100%" as const, top: 0, marginHorizontal: 6 };
    case "right":
      return { left: "100%" as const, top: 0, marginHorizontal: 6 };
    case "top":
    default:
      return { bottom: "100%" as const, left: 0, marginVertical: 6 };
  }
}

function Tooltip({
  content,
  children,
  placement = "top",
  width = 200,
  testID,
}: TooltipProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ position: "relative", alignSelf: "flex-start" }} testID={testID}>
      <Pressable
        accessibilityHint={content}
        accessibilityRole="button"
        onPress={() => setVisible((v) => !v)}
      >
        {children}
      </Pressable>
      {visible ? (
        <View
          style={{
            position: "absolute",
            ...resolvePosition(placement),
            width,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: theme.text.primary,
            ...theme.shadow.md,
            zIndex: 1700,
          }}
        >
          <Typography.Text style={{ color: theme.bg.card }} variant="bodySmall">
            {content}
          </Typography.Text>
        </View>
      ) : null}
    </View>
  );
}

export default Tooltip;
