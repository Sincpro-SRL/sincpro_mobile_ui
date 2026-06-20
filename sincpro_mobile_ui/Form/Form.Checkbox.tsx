import { Checkbox } from "expo-checkbox";
import { Pressable, View } from "react-native";

import { theme } from "../theme";
import { cn } from "../theme/tw";
import { Typography } from "../Typography";

interface RowCheckBoxProps {
  mainText?: string;
  subText?: string;
  rightText?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  isChecked?: boolean;
  onCheck?: (isChecked: boolean) => void;
  disabled?: boolean;
  className?: string;
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
  className,
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
      className={cn(
        "flex-row justify-between items-center",
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      onPress={handlePress}
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
