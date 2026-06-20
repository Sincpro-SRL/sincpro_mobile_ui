import React, { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import { Display } from "../Display";
import GradientContainer from "../layouts/GradientContainer";
import { theme } from "../theme";
import { cn } from "../theme/tw";
import { Typography } from "../Typography";

export interface HeaderProps {
  title?: string;
  logo?: ReactNode;
  backButton?: boolean;
  handleBackButton?: () => void;
  className?: string;
}

const Header = ({ title, logo, backButton, handleBackButton, className }: HeaderProps) => {
  const onBackPress = handleBackButton ?? (() => {});

  return (
    <GradientContainer className={cn("pt-10 pb-3.5 px-4", className)}>
      <View className="relative items-center justify-center">
        {backButton && (
          <TouchableOpacity
            className="absolute top-0 left-0 z-10 border border-white p-1.5 rounded"
            onPress={onBackPress}
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
          {logo || <Display.Logo size="medium" />}
          {title && (
            <Typography.Text className="text-white" variant="h4">
              {title}
            </Typography.Text>
          )}
        </View>
      </View>
    </GradientContainer>
  );
};

export default Header;
