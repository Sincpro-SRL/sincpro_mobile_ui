import { PillLabel } from "@sincpro/mobile-ui/Display/pill";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface TagProps {
  label: string;
  leading?: ReactNode;
  dotColor?: string;
  className?: string;
  testID?: string;
}

function Tag({ label, leading, dotColor, className, testID }: TagProps) {
  return (
    <View
      className={cn(
        "flex-row items-center self-start rounded-full bg-bg-muted px-2.5 py-1 gap-1.5",
        className,
      )}
      testID={testID}
    >
      {dotColor ? (
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />
      ) : null}
      {leading}
      <PillLabel className="text-text-secondary">{label}</PillLabel>
    </View>
  );
}

export default Tag;
export { Tag };
