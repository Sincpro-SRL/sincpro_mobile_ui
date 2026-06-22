import { theme } from "@sincpro/mobile-ui/theme";
import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export interface ProgressCircleProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
  testID?: string;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function ProgressCircle({
  value = 0,
  size = 64,
  strokeWidth = 6,
  color,
  trackColor,
  children,
  testID,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value));
  const center = size / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamp(value) * 100), min: 0, max: 100 }}
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
      testID={testID}
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
