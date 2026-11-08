import KeyboardForm, {
  type KeyboardFormProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import type { SafeAreaEdge } from "@sincpro/mobile-ui/layouts/edges";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ScrollContainerProps extends Omit<
  KeyboardFormProps,
  "children" | "className"
> {
  children: ReactNode;
  /** Classes of the safe-area surface. */
  className?: string;
  /** Edges this container reserves. Lateral by default: the header owns top. */
  edges?: SafeAreaEdge[];
}

/**
 * Scrollable page surface. The scroll is the DS `KeyboardForm`, so the space kept
 * above the keyboard and the toolbar group are the same as in every form, and iOS
 * keeps adjusting the content inset natively (large titles, NativeTabs).
 */
function ScrollContainer({
  children,
  className,
  edges = ["left", "right"],
  contentContainerStyle,
  contentInsetAdjustmentBehavior = "automatic",
  showsVerticalScrollIndicator = false,
  ...form
}: ScrollContainerProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-bg-card", className)} edges={edges}>
      <KeyboardForm
        contentContainerStyle={[{ flexGrow: 1, padding: 16 }, contentContainerStyle]}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        {...form}
      >
        <View className="flex-1">{children}</View>
      </KeyboardForm>
    </SafeAreaView>
  );
}

export default ScrollContainer;
