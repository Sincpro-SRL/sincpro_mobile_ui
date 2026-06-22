import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { BaseButton } from "@sincpro/mobile-ui/primitives/BaseButton";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface PermissionCardProps {
  title: string;
  description?: string;
  granted?: boolean;
  icon?: string;
  grantedLabel?: string;
  deniedLabel?: string;
  actionLabel?: string;
  loading?: boolean;
  onRequest?: () => void;
  className?: string;
  testID?: string;
}

function PermissionCard({
  title,
  description,
  granted = false,
  icon = "lock-closed",
  grantedLabel = "Permiso activo",
  deniedLabel = "Permiso inactivo",
  actionLabel = "Permitir",
  loading = false,
  onRequest,
  className,
  testID,
}: PermissionCardProps) {
  return (
    <View
      className={cn("bg-bg-card rounded-xl p-4 border border-border-light", className)}
      style={theme.shadow.sm}
      testID={testID}
    >
      <View className="flex-row items-start gap-3">
        <Icon
          color={granted ? theme.success : theme.danger}
          name={granted ? "checkmark-circle" : icon}
          size={32}
        />
        <View className="flex-1 gap-1">
          <Typography.Text className="text-text-primary" semibold variant="body">
            {title}
          </Typography.Text>
          {description ? (
            <Typography.Text className="text-text-secondary" variant="bodySmall">
              {description}
            </Typography.Text>
          ) : null}
          <Typography.Text
            style={{ color: granted ? theme.success : theme.danger }}
            variant="bodySmall"
          >
            {granted ? grantedLabel : deniedLabel}
          </Typography.Text>
          {!granted && onRequest ? (
            <View className="mt-2 self-start">
              <BaseButton
                loading={loading}
                onPress={onRequest}
                size="small"
                title={actionLabel}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default PermissionCard;
