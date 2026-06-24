import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { type ReactNode, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export interface SwipeRowAction {
  label?: string;
  icon?: string;
  color?: string;
  onPress: () => void;
}

export interface SwipeableRowProps {
  children: ReactNode;
  rightActions?: SwipeRowAction[];
  leftActions?: SwipeRowAction[];
  testID?: string;
}

function ActionButtons({
  actions,
  onDone,
}: {
  actions: SwipeRowAction[];
  onDone: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: "row" }}>
      {actions.map((action, index) => (
        <TouchableOpacity
          accessibilityLabel={action.label ?? "Acción"}
          accessibilityRole="button"
          activeOpacity={0.8}
          key={index}
          onPress={() => {
            onDone();
            action.onPress();
          }}
          style={{
            backgroundColor: action.color ?? theme.danger,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          {action.icon ? (
            <Icon color={theme.text.inverse} name={action.icon} size={20} />
          ) : null}
          {action.label ? (
            <Typography.Text className="text-text-inverse text-xs mt-1">
              {action.label}
            </Typography.Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SwipeableRow({ children, rightActions, leftActions, testID }: SwipeableRowProps) {
  const ref = useRef<Swipeable>(null);
  const close = () => ref.current?.close();

  return (
    <Swipeable
      ref={ref}
      renderLeftActions={
        leftActions?.length
          ? () => <ActionButtons actions={leftActions} onDone={close} />
          : undefined
      }
      renderRightActions={
        rightActions?.length
          ? () => <ActionButtons actions={rightActions} onDone={close} />
          : undefined
      }
      testID={testID}
    >
      {children}
    </Swipeable>
  );
}

export default SwipeableRow;
