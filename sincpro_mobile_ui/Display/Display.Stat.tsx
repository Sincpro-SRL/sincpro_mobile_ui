import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

export interface StatProps {
  value: string | number;
  label: string;
  align?: "center" | "start";
  className?: string;
  testID?: string;
}

function Stat({ value, label, align = "center", className, testID }: StatProps) {
  return (
    <View
      className={cn(align === "center" ? "items-center" : "items-start", className)}
      testID={testID}
    >
      <Typography.Text className="text-text-primary" semibold variant="subtitle">
        {value}
      </Typography.Text>
      <Typography.Text className="text-text-secondary" variant="caption">
        {label}
      </Typography.Text>
    </View>
  );
}

export default Stat;
export { Stat };
