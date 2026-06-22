import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface StepsProps {
  steps: string[];
  current: number;
  className?: string;
  testID?: string;
}

function Steps({ steps, current, className, testID }: StepsProps) {
  return (
    <View
      accessibilityLabel={`Paso ${current + 1} de ${steps.length}`}
      className={cn("flex-row items-start", className)}
      testID={testID}
    >
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        const circleColor = done || active ? theme.primary : theme.bg.muted;
        const textColor = done || active ? theme.text.inverse : theme.text.tertiary;
        const isLast = index === steps.length - 1;

        return (
          <View className="flex-1 items-center" key={label}>
            <View className="flex-row items-center w-full">
              <View className="flex-1 h-0.5" style={{ backgroundColor: "transparent" }} />
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{ backgroundColor: circleColor }}
              >
                {done ? (
                  <Icon color={theme.text.inverse} name="checkmark" size={16} />
                ) : (
                  <Typography.Text style={{ color: textColor }} variant="bodySmall">
                    {index + 1}
                  </Typography.Text>
                )}
              </View>
              <View
                className="flex-1 h-0.5"
                style={{ backgroundColor: isLast ? "transparent" : theme.border.default }}
              />
            </View>
            <Typography.Text
              className="mt-1 text-center"
              numberOfLines={1}
              style={{ color: active ? theme.primary : theme.text.tertiary }}
              variant="caption"
            >
              {label}
            </Typography.Text>
          </View>
        );
      })}
    </View>
  );
}

export default Steps;
