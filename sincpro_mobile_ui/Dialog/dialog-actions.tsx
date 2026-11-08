import Button, { type ButtonProps } from "@sincpro/mobile-ui/Actions/Actions.Button";
import { View } from "react-native";

export interface DialogAction {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

/**
 * The footer of every dialog in the DS, as the app dialogs already draw it: cancel (outline)
 * and confirm side by side, half the width each.
 */
export function DialogActions({
  cancel,
  confirm,
  confirmVariant = "primary",
}: {
  cancel: DialogAction;
  confirm?: DialogAction;
  confirmVariant?: ButtonProps["variant"];
}) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button {...cancel} variant="outline" />
      </View>
      {confirm ? (
        <View className="flex-1">
          <Button {...confirm} variant={confirmVariant} />
        </View>
      ) : null}
    </View>
  );
}
