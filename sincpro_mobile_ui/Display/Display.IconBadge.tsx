import { CountBadge } from "@sincpro/mobile-ui/Display/count-badge";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
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

  const content = (
    <View style={{ position: "relative" }}>
      {children}
      {dot || showCount ? (
        <CountBadge
          anchor={{ top: -4, right: -6 }}
          color={color}
          count={count}
          dot={dot}
          max={max}
        />
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
