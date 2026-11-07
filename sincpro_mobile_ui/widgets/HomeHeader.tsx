import { Display, Typography } from "@sincpro/mobile-ui/index";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import ScreenStatusBar from "@sincpro/mobile-ui/layouts/ScreenStatusBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import React, { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HomeHeaderProps {
  readonly title?: string;
  readonly logo?: ReactNode;
  readonly logoSource?: ImageSource;
  readonly backButton?: boolean;
  readonly onBack?: () => void;
  readonly safeArea?: boolean;
  readonly barStyle?: "light-content" | "dark-content";
}

/**
 * @deprecated Legacy style (gradient). For new top bars use `Navigation.AppBar`.
 * Kept for backwards compatibility.
 */
export const HomeHeader: React.FC<HomeHeaderProps> = ({
  title = "Distribución",
  logo,
  logoSource,
  backButton = false,
  onBack,
  safeArea = true,
  barStyle,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const handleBackPress = onBack ?? (() => {});

  return (
    <GradientContainer
      className="pb-4 px-4"
      style={{ paddingTop: 40 + (safeArea ? insets.top : 0) }}
    >
      {safeArea || barStyle !== undefined ? (
        <ScreenStatusBar backgroundColor={theme.gradient.primary[0]} barStyle={barStyle} />
      ) : null}
      <View className="relative items-center justify-center">
        {backButton && (
          <TouchableOpacity
            className="absolute top-0 left-0 z-10 border border-text-inverse p-1.5 rounded"
            onPress={handleBackPress}
          >
            <Display.Icon
              color={theme.text.inverse}
              name="chevron-back"
              size={25}
              type="ionicons"
            />
          </TouchableOpacity>
        )}
        <View className="items-center justify-center">
          {logo || <Display.Logo size="medium" source={logoSource} />}
          {!!title && (
            <Typography.Text className="text-text-inverse" variant="h4">
              {title}
            </Typography.Text>
          )}
        </View>
      </View>
    </GradientContainer>
  );
};
