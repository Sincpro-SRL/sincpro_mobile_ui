import { Display } from "@sincpro/mobile-ui/Display";
import GradientSurface from "@sincpro/mobile-ui/Display/Display.GradientSurface";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { ReactNode } from "react";
import {
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthContainerProps {
  header: ReactNode;
  children: ReactNode;
  onBackPress?: () => void;
  className?: string;
}

function AuthContainer({ header, children, onBackPress, className }: AuthContainerProps) {
  const screenHeight = Dimensions.get("window").height;

  return (
    <GradientSurface
      className={cn("flex-1", className)}
      preset="night-green"
      radius="none"
      style={{ flex: 1 }}
    >
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
                    color={theme.text.inverse}
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
            <KeyboardAwareScrollView
              bottomOffset={50}
              bounces={false}
              className="flex-1"
              contentContainerClassName="flex-grow pb-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="p-4">{children}</View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </GradientSurface>
  );
}

export default AuthContainer;
