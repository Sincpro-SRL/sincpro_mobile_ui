import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { Pattern, type PatternKind } from "@sincpro/mobile-ui/Display/Display.Pattern";
import KeyboardForm, {
  type KeyboardFormProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import type { SafeAreaEdge } from "@sincpro/mobile-ui/layouts/edges";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { ReactNode } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthContainerProps {
  header: ReactNode;
  children: ReactNode;
  onBackPress?: () => void;
  className?: string;
  edges?: SafeAreaEdge[];
  keyboardFormProps?: Omit<KeyboardFormProps, "children">;
  /** Gradient + optional texture surface for the header area. Defaults to the `brand`
   *  preset. Set `background.pattern` to opt-in a texture (`dots` / `grid` /
   *  `diagonals`); compose `<Display.Pattern kind="mesh" />` outside if you want the
   *  brand symbol. */
  background?: AppBarBackground;
}

function AuthContainer({
  header,
  children,
  onBackPress,
  background,
  className,
  edges = ["top", "bottom", "left", "right"],
  keyboardFormProps,
}: AuthContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // The sheet runs to the screen edge; the bottom inset becomes padding inside it,
  // so the brand gradient never shows as a strip under the home indicator.
  const reservesBottom = edges.includes("bottom");
  const outerEdges = edges.filter((edge) => edge !== "bottom");

  return (
    <GradientSurface
      className={cn("flex-1", className)}
      colors={background?.colors}
      end={background?.end ?? (background?.colors ? { x: 0, y: 1 } : undefined)}
      preset={background?.surface ?? "brand"}
      radius="none"
      start={background?.start ?? (background?.colors ? { x: 0, y: 0 } : undefined)}
      style={{ flex: 1 }}
    >
      {background?.pattern ? (
        <Pattern
          color={background.patternColor ?? "#FFFFFF"}
          kind={background.pattern as PatternKind}
          opacity={background.patternOpacity ?? 0.18}
        />
      ) : null}
      <SafeAreaView className="flex-1" edges={outerEdges}>
        <View className="flex-1">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="items-center justify-end px-6 pt-12 pb-14 relative"
              style={{ minHeight: "28%" }}
            >
              {onBackPress && (
                <IconButton
                  accessibilityLabel="Volver"
                  className="absolute top-2 left-2 z-[1]"
                  icon="back"
                  iconColor={background?.textColor ?? theme.text.inverse}
                  onPress={onBackPress}
                  size="large"
                />
              )}
              {header}
            </View>
          </TouchableWithoutFeedback>
          <View className="flex-1 -mt-8 bg-bg-card rounded-t-[32px] shadow-lg">
            <KeyboardForm
              bounces={false}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: (reservesBottom ? insets.bottom : 0) + 24,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              {...keyboardFormProps}
            >
              <View className="px-6 pt-8">{children}</View>
            </KeyboardForm>
          </View>
        </View>
      </SafeAreaView>
    </GradientSurface>
  );
}

export default AuthContainer;
