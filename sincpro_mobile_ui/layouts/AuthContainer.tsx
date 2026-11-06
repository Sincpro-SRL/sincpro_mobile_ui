import { Display } from "@sincpro/mobile-ui/Display";
import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { Pattern, type PatternKind } from "@sincpro/mobile-ui/Display/Display.Pattern";
import KeyboardForm, {
  type KeyboardFormProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { ReactNode } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthContainerProps {
  header: ReactNode;
  children: ReactNode;
  onBackPress?: () => void;
  className?: string;
  keyboardToolbar?: boolean;
  keyboardFormProps?: Omit<KeyboardFormProps, "children" | "toolbar">;
  /** Gradient + optional texture surface for the header area. Defaults to the `warm`
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
  keyboardToolbar = false,
  keyboardFormProps,
}: AuthContainerProps) {
  const { height: screenHeight } = useWindowDimensions();
  const theme = useTheme();

  return (
    <GradientSurface
      className={cn("flex-1", className)}
      colors={background?.colors}
      end={background?.end ?? (background?.colors ? { x: 0, y: 1 } : undefined)}
      preset={background?.surface ?? "warm"}
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
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className="justify-center items-center relative"
              style={{ height: screenHeight * 0.3 }}
            >
              {onBackPress && (
                <TouchableOpacity
                  className="absolute top-4 left-4 p-2 z-[1]"
                  onPress={onBackPress}
                >
                  <Display.Icon
                    color={background?.textColor ?? theme.text.inverse}
                    name="arrow-back"
                    size={24}
                    type="ionicons"
                  />
                </TouchableOpacity>
              )}
              {header}
            </View>
          </TouchableWithoutFeedback>
          <View
            className="flex-1 bg-bg-card rounded-t-3xl shadow-lg"
            style={{ minHeight: screenHeight * 0.7 }}
          >
            <KeyboardForm
              bottomOffset={keyboardToolbar ? undefined : 50}
              bounces={false}
              className="flex-1"
              contentContainerClassName="flex-grow pb-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              {...keyboardFormProps}
              toolbar={keyboardToolbar}
            >
              <View className="p-4">{children}</View>
            </KeyboardForm>
          </View>
        </View>
      </SafeAreaView>
    </GradientSurface>
  );
}

export default AuthContainer;
