import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  delta?: number;
  deltaSuffix?: string;
  hint?: string;
  trailing?: ReactNode;
  className?: string;
  testID?: string;
}

function StatCard({
  label,
  value,
  icon,
  delta,
  deltaSuffix = "%",
  hint,
  trailing,
  className,
  testID,
}: StatCardProps) {
  const hasDelta = typeof delta === "number";
  const up = hasDelta && delta >= 0;
  const deltaColor = up ? theme.success : theme.danger;

  return (
    <View
      className={cn("bg-bg-card rounded-lg border border-border-light p-4 gap-1", className)}
      style={theme.shadow.sm}
      testID={testID}
    >
      <View className="flex-row items-center justify-between">
        <Typography.Text className="text-text-secondary" variant="caption">
          {label}
        </Typography.Text>
        {icon ? <Icon color={theme.icon.secondary} name={icon} size={18} /> : null}
        {trailing}
      </View>
      <Typography.Text className="text-text-primary" semibold variant="h3">
        {value}
      </Typography.Text>
      {hasDelta || hint ? (
        <View className="flex-row items-center gap-1">
          {hasDelta ? (
            <>
              <Icon color={deltaColor} name={up ? "arrow-up" : "arrow-down"} size={14} />
              <Typography.Text style={{ color: deltaColor }} variant="caption">
                {Math.abs(delta)}
                {deltaSuffix}
              </Typography.Text>
            </>
          ) : null}
          {hint ? (
            <Typography.Text className="text-text-tertiary" variant="caption">
              {hint}
            </Typography.Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default StatCard;
