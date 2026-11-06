import { useTheme } from "@sincpro/mobile-ui/theme";
import { normalizeProgress } from "@sincpro/mobile-ui/utils/progress";
import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import Svg, { Circle } from "react-native-svg";

export interface ProgressCircleProps extends Omit<
  ViewProps,
  "accessibilityValue" | "accessibilityRole"
> {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
  testID?: string;
}

function ProgressCircle({
  value = 0,
  size = 64,
  strokeWidth = 6,
  color,
  trackColor,
  children,
  style,
  ...props
}: ProgressCircleProps) {
  const theme = useTheme();
  const progress = normalizeProgress(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <View
      {...props}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
      accessible
      style={[
        { width: size, height: size, alignItems: "center", justifyContent: "center" },
        style,
      ]}
    >
      <Svg height={size} style={{ position: "absolute" }} width={size}>
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={trackColor ?? theme.bg.muted}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={color ?? theme.primary}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}

export default ProgressCircle;
