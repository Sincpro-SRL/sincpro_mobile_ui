import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface FABProps {
  icon: string;
  onPress: () => void;
  label?: string;
  position?: "bottom-right" | "bottom-left";
  className?: string;
  testID?: string;
}

function FAB({
  icon,
  onPress,
  label,
  position = "bottom-right",
  className,
  testID,
}: FABProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityLabel={label ?? "Acción"}
      accessibilityRole="button"
      className={cn(
        "absolute flex-row items-center justify-center rounded-full bg-primary",
        label ? "h-14 px-5 gap-2" : "w-14 h-14",
        className,
      )}
      onPress={onPress}
      style={{
        bottom: insets.bottom + 16,
        right: position === "bottom-right" ? 16 : undefined,
        left: position === "bottom-left" ? 16 : undefined,
        ...theme.shadow.lg,
      }}
      testID={testID}
    >
      <Icon color={theme.icon.inverse} name={icon} size={24} />
      {label ? (
        <Typography.Text className="text-text-on-primary font-semibold">
          {label}
        </Typography.Text>
      ) : null}
    </Pressable>
  );
}

export default FAB;
