import { Display } from "@sincpro/mobile-ui/Display";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type React from "react";
import { TouchableOpacity, View } from "react-native";

const Icon = Display.Icon;
const Text = Typography.Text;

interface HeaderToolbarProps {
  title?: string;
  logo?: boolean;
  centerTitle?: boolean;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  flat?: boolean;
  children?: React.ReactNode;
  withBackground?: boolean;
  className?: string;
}

function HeaderToolbar({
  title = "",
  subtitle,
  onBack,
  rightComponent,
  centerTitle = false,
  flat = false,
  children,
  logo = false,
  withBackground = true,
  className,
}: HeaderToolbarProps) {
  const borderRadius = flat ? "rounded-none" : "rounded-b-[20px]";
  const paddingBottom = flat ? "pb-0" : "pb-4";

  function renderToolbar() {
    return (
      <>
        <View className="flex-row items-center justify-between px-3.5 pt-2.5 h-16 relative">
          {onBack && (
            <TouchableOpacity
              className="mr-3.5 border border-white rounded-lg items-center justify-center mb-3.5 p-1.5 z-[1]"
              onPress={onBack}
            >
              <Icon
                color={theme.text.inverse}
                name="chevron-back"
                size={25}
                type="ionicons"
              />
            </TouchableOpacity>
          )}

          {logo && (
            <View className="absolute left-0 right-0 items-center justify-center z-0">
              <Display.Logo size="medium" />
            </View>
          )}

          {!logo && (
            <View
              className={cn(
                "flex-1",
                centerTitle && "absolute left-0 right-0 items-center justify-center z-[1]",
              )}
            >
              <Text
                className="text-white"
                numberOfLines={1}
                style={{ top: centerTitle ? 0 : -4 }}
                variant={centerTitle ? "h4" : "h6"}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  className="text-white"
                  style={{ top: centerTitle ? 0 : -4 }}
                  variant="bodySmall"
                >
                  {subtitle}
                </Text>
              )}
            </View>
          )}

          {rightComponent && <View className="ml-auto">{rightComponent}</View>}
        </View>

        <View>{children}</View>
      </>
    );
  }

  return withBackground ? (
    <GradientContainer
      className={cn("shadow-lg shadow-black/70", borderRadius, paddingBottom, className)}
    >
      {renderToolbar()}
    </GradientContainer>
  ) : (
    <>{renderToolbar()}</>
  );
}

export default HeaderToolbar;
