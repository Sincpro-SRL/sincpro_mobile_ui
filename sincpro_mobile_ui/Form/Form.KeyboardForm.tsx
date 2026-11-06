import KeyboardToolbar, {
  type KeyboardToolbarProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import { type ReactNode } from "react";
import { useState } from "react";
import { View } from "react-native";
import type { KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar as NativeToolbar,
} from "react-native-keyboard-controller";

export interface KeyboardFormProps extends KeyboardAwareScrollViewProps {
  children: ReactNode;
  toolbar?: boolean;
  toolbarLabels?: Pick<KeyboardToolbarProps, "previousLabel" | "nextLabel" | "doneLabel">;
}

export default function KeyboardForm({
  children,
  toolbar = true,
  toolbarLabels,
  bottomOffset,
  style,
  ...props
}: KeyboardFormProps) {
  const [toolbarHeight, setToolbarHeight] = useState(48);
  return (
    <View style={{ flex: 1 }}>
      <NativeToolbar.Group style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          bottomOffset={bottomOffset ?? (toolbar ? toolbarHeight + 24 : 20)}
          keyboardShouldPersistTaps="handled"
          style={[{ flex: 1 }, style]}
          {...props}
        >
          {children}
        </KeyboardAwareScrollView>
      </NativeToolbar.Group>
      {toolbar ? (
        <KeyboardToolbar {...toolbarLabels} onHeightChange={setToolbarHeight} />
      ) : null}
    </View>
  );
}
