import { useKeyboardToolbarInset } from "@sincpro/mobile-ui/Form/Form.KeyboardToolbarHost";
import type { ReactElement, ReactNode } from "react";
import {
  type RefreshControlProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";

/** Space kept between the focused input and whatever sits above the keyboard. */
const FOCUS_GAP = 24;

export interface KeyboardFormProps {
  children: ReactNode;
  /** Overrides the computed space below the focused input. */
  bottomOffset?: number;
  /** Height of a footer that stays above the keyboard, such as a sticky action bar. */
  stickyFooterHeight?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  className?: string;
  contentContainerClassName?: string;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  refreshControl?: ReactElement<RefreshControlProps>;
  /** iOS: let the system inset the content under large titles and NativeTabs. */
  contentInsetAdjustmentBehavior?: "automatic" | "never";
  testID?: string;
}

/**
 * The one keyboard-aware scroll of a form. Its inputs form a toolbar group, so
 * the global KeyboardToolbarHost moves focus only among them.
 */
export default function KeyboardForm({
  children,
  bottomOffset,
  stickyFooterHeight = 0,
  style,
  keyboardShouldPersistTaps = "handled",
  ...scroll
}: KeyboardFormProps) {
  const toolbarInset = useKeyboardToolbarInset();
  return (
    <KeyboardToolbar.Group style={styles.fill}>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset ?? stickyFooterHeight + toolbarInset + FOCUS_GAP}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        style={[styles.fill, style]}
        {...scroll}
      >
        {children}
      </KeyboardAwareScrollView>
    </KeyboardToolbar.Group>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
