import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export type StatusKind = "online" | "offline" | "busy" | "away";

export interface StatusDotProps {
  status?: StatusKind;
  label?: string;
  size?: number;
  color?: string;
  className?: string;
  testID?: string;
}

const statusColor: Record<StatusKind, string> = {
  online: theme.success,
  offline: theme.icon.disabled,
  busy: theme.danger,
  away: theme.warning,
};

const statusLabel: Record<StatusKind, string> = {
  online: "En línea",
  offline: "Desconectado",
  busy: "Ocupado",
  away: "Ausente",
};

function StatusDot({
  status = "online",
  label,
  size = 8,
  color,
  className,
  testID,
}: StatusDotProps) {
  const dotColor = color ?? statusColor[status];
  const text = label ?? statusLabel[status];

  return (
    <View
      accessibilityLabel={text}
      className={cn("flex-row items-center gap-1.5", className)}
      testID={testID}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
        }}
      />
      {text ? (
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {text}
        </Typography.Text>
      ) : null}
    </View>
  );
}

export default StatusDot;
