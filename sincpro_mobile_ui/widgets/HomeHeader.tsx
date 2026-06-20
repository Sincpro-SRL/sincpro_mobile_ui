import { Display, Typography } from "@sincpro/mobile-ui/index";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import { theme } from "@sincpro/mobile-ui/theme";
import React, { ReactNode } from "react";
import { type ImageSourcePropType, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  readonly title?: string;
  readonly logo?: ReactNode;
  readonly logoSource?: ImageSourcePropType;
  readonly backButton?: boolean;
  readonly onBack?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  title = "Distribución",
  logo,
  logoSource,
  backButton = false,
  onBack,
}) => {
  const handleBackPress = onBack ?? (() => {});

  return (
    <GradientContainer className="pt-10 pb-4 px-4">
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
