import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface TimelineStep {
  title: string;
  description?: string;
  time?: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  current: number;
  className?: string;
  testID?: string;
}

function Timeline({ steps, current, className, testID }: TimelineProps) {
  return (
    <View className={className} testID={testID}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const reached = done || active;
        const isLast = index === steps.length - 1;
        const dotColor = reached ? theme.primary : theme.bg.muted;

        return (
          <View className="flex-row" key={step.title}>
            <View className="items-center" style={{ width: 28 }}>
              <View
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{ backgroundColor: dotColor }}
              >
                {done ? (
                  <Icon color={theme.text.inverse} name="checkmark" size={14} />
                ) : (
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: active ? theme.text.inverse : theme.border.strong,
                    }}
                  />
                )}
              </View>
              {!isLast ? (
                <View
                  className="flex-1 w-0.5 my-1"
                  style={{ backgroundColor: done ? theme.primary : theme.border.default }}
                />
              ) : null}
            </View>

            <View className={cn("flex-1 pb-5", isLast && "pb-0")}>
              <View className="flex-row items-center justify-between">
                <Typography.Text
                  className={reached ? "text-text-primary" : "text-text-tertiary"}
                  semibold={active}
                  variant="body"
                >
                  {step.title}
                </Typography.Text>
                {step.time ? (
                  <Typography.Text className="text-text-tertiary" variant="caption">
                    {step.time}
                  </Typography.Text>
                ) : null}
              </View>
              {step.description ? (
                <Typography.Text className="text-text-secondary" variant="bodySmall">
                  {step.description}
                </Typography.Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default Timeline;
