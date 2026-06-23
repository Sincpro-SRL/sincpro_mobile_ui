import { Display, Form } from "@sincpro/mobile-ui/index";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";
import { tv } from "tailwind-variants";

const statusTextVariants = tv({
  variants: {
    granted: {
      true: "text-success",
      false: "text-danger",
    },
  },
});

interface GeoPermissionCardProps {
  title: string;
  hasPermission?: boolean;
  loading?: boolean;
  handleRequestPermission?: () => void;
}

/**
 * @deprecated Domain-coupled (geo permission + Spanish copy); relocated to the core.
 * Import from `@sincpro/mobile/ui/components/molecules` instead. Kept here for
 * backwards compatibility and removed in the next major.
 */
function GeoPermissionCard({
  title,
  loading,
  handleRequestPermission,
  hasPermission,
}: GeoPermissionCardProps) {
  const granted = hasPermission !== undefined ? hasPermission : false;

  return (
    <View className="bg-bg-muted rounded-xl p-5 my-2.5 shadow-sm">
      <View className="flex-row items-start">
        <Display.Icon
          color={granted ? theme.success : theme.danger}
          name={granted ? "check-circle" : "location-off"}
          size={35}
          type="material"
        />
        <View className="ml-2.5 flex-1">
          <Typography.Text className="text-base mb-1" semibold>
            {title}
          </Typography.Text>
          <Typography.Text className={statusTextVariants({ granted })}>
            {granted ? "Permiso activo." : "Permiso inactivo."}
          </Typography.Text>
          {!granted && (
            <Form.Button
              loading={loading}
              onPress={handleRequestPermission}
              size="small"
              title={"Abrir Configuración"}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default GeoPermissionCard;
