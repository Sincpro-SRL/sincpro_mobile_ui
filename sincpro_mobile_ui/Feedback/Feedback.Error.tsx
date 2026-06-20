import { Display } from "@sincpro/mobile-ui/Display";
import Button from "@sincpro/mobile-ui/Form/Form.Button";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  onHome?: () => void;
  className?: string;
}

function Error({ message, onRetry, onBack, onHome, className }: ErrorProps) {
  return (
    <View className={cn("flex-1 items-center justify-center px-4", className)}>
      <Display.Icon color="#ef4444" name="exclamation-circle" size={80} type="fontawesome5" />
      <Typography.Text className="pt-4 text-text-primary" semibold variant="h3">
        ¡Error!
      </Typography.Text>
      <Typography.Text
        className="pt-2 text-center text-base leading-5.5 text-text-secondary"
        variant="h5"
      >
        {message || "Ocurrió un error al cargar la información"}
      </Typography.Text>
      <View className="mt-8 w-full gap-3">
        {onRetry && <Button className="w-full" onPress={onRetry} title="Reintentar" />}
        {onBack && (
          <Button className="w-full" onPress={onBack} title="Volver" variant="secondary" />
        )}
        {onHome && (
          <Button
            className="w-full"
            onPress={onHome}
            title="Ir al inicio"
            variant="outline"
          />
        )}
      </View>
    </View>
  );
}

export default Error;
