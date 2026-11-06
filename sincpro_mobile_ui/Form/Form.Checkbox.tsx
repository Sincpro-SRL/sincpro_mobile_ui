import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { Checkbox } from "expo-checkbox";
import { Pressable, View } from "react-native";

interface RowCheckBoxProps {
  mainText?: string;
  subText?: string;
  rightText?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  isChecked?: boolean;
  onCheck?: (isChecked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibleSizing?: boolean;
  className?: string;
  testID?: string;
}

function RowCheckBox({
  mainText,
  subText,
  rightText,
  rightComponent,
  leftComponent,
  isChecked = false,
  onCheck = () => {},
  disabled = false,
  accessibilityLabel,
  accessibleSizing = false,
  className,
  testID,
}: RowCheckBoxProps) {
  const handlePress = () => {
    if (!disabled) {
      onCheck(!isChecked);
    }
  };

  const renderLeftComponent = () => {
    if (leftComponent) {
      return leftComponent;
    }
    return (
      <>
        {mainText && <Typography.Text semibold>{mainText}</Typography.Text>}
        {subText && (
          <Typography.Text className="text-text-secondary" variant="bodySmall">
            {subText}
          </Typography.Text>
        )}
      </>
    );
  };

  const renderRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }
    if (rightText) {
      return <Typography.Text variant="body">{rightText}</Typography.Text>;
    }
    return null;
  };

  return (
    <Pressable
      accessibilityLabel={
        accessibilityLabel ?? [mainText, subText, rightText].filter(Boolean).join(", ")
      }
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      className={cn(
        "flex-row justify-between items-center",
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      onPress={handlePress}
      style={accessibleSizing ? { minHeight: 48, paddingVertical: 8 } : undefined}
      testID={testID}
    >
      <View>{renderLeftComponent()}</View>

      <View className="flex-row items-center">
        {renderRightComponent()}
        <Checkbox
          className="ml-2"
          color={theme.primary}
          disabled={disabled}
          pointerEvents="none"
          value={isChecked}
        />
      </View>
    </Pressable>
  );
}

export default RowCheckBox;
