import KeyboardToolbar, {
  type KeyboardToolbarProps,
} from "@sincpro/mobile-ui/Form/Form.KeyboardToolbar";
import { type ReactNode, type Ref } from "react";
import { useState } from "react";
import { View } from "react-native";
import type {
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar as NativeToolbar,
} from "react-native-keyboard-controller";

export interface KeyboardFormProps extends KeyboardAwareScrollViewProps {
  children: ReactNode;
  ref?: Ref<KeyboardAwareScrollViewRef>;
  toolbar?: boolean;
  toolbarProps?: Omit<KeyboardToolbarProps, "onHeightChange">;
  toolbarLabels?: Pick<
    KeyboardToolbarProps,
    "previousLabel" | "nextLabel" | "doneLabel" | "showDoneLabel"
  >;
}

export default function KeyboardForm({
  children,
  toolbar = true,
  toolbarLabels,
  toolbarProps,
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
        <KeyboardToolbar
          {...toolbarLabels}
          {...toolbarProps}
          onHeightChange={setToolbarHeight}
        />
      ) : null}
    </View>
  );
}
