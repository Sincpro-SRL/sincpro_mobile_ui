import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useState } from "react";
import { View } from "react-native";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  placement?: "top" | "bottom";
  width?: number;
  testID?: string;
}

function Tooltip({
  content,
  children,
  placement = "top",
  width = 200,
  testID,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const isTop = placement === "top";

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
            [isTop ? "bottom" : "top"]: "100%",
            left: 0,
            width,
            marginVertical: 6,
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
