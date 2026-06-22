import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface IconBadgeProps {
  children: ReactNode;
  count?: number;
  max?: number;
  dot?: boolean;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

function IconBadge({
  children,
  count,
  max = 99,
  dot = false,
  color,
  onPress,
  accessibilityLabel,
  testID,
}: IconBadgeProps) {
  const showCount = typeof count === "number" && count > 0;
  const showBadge = dot || showCount;
  const label = showCount ? (count > max ? `${max}+` : String(count)) : "";
  const badgeColor = color ?? theme.danger;

  const content = (
    <View style={{ position: "relative" }}>
      {children}
      {showBadge ? (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -6,
            minWidth: dot ? 10 : 18,
            height: dot ? 10 : 18,
            borderRadius: 999,
            paddingHorizontal: dot ? 0 : 4,
            backgroundColor: badgeColor,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: theme.bg.card,
          }}
        >
          {!dot && label ? (
            <Typography.Text
              style={{ color: theme.text.inverse, fontSize: 10, lineHeight: 12 }}
            >
              {label}
            </Typography.Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        hitSlop={10}
        onPress={onPress}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel} testID={testID}>
      {content}
    </View>
  );
}

export default IconBadge;
