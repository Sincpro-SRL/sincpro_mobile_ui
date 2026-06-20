import { Display } from "@sincpro/mobile-ui/Display";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

interface EmptyProps {
  handleGoHome?: () => void;
  className?: string;
}

function Empty({ handleGoHome, className }: EmptyProps) {
  return (
    <View className={cn("flex-1 items-center justify-center px-4", className)}>
      <Display.Icon name="sad-cry" size={80} type="fontawesome5" />
      <Typography.Text className="pt-4 text-text-primary" semibold variant="h3">
        ¡Oops!
      </Typography.Text>
      <Typography.Text
        className="pt-2 text-center text-base leading-5.5 text-text-secondary"
        variant="h5"
      >
        No se encontraron registros disponibles.
      </Typography.Text>
    </View>
  );
}

export default Empty;
