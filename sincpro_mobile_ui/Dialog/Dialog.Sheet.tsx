import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
  dismissible?: boolean;
  testID?: string;
};

const SNAP_POINTS = ["60%", "90%"];

function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
  snapPoints = SNAP_POINTS,
  scrollable = true,
  dismissible = true,
  testID,
}: SheetProps) {
  const theme = useTheme();
  const close = () => {
    if (visible && dismissible) onClose();
  };

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: theme.bg.card }}
      enablePanDownToClose={dismissible}
      index={visible ? 0 : -1}
      onClose={close}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View
          accessibilityViewIsModal
          importantForAccessibility="yes"
          onAccessibilityEscape={close}
          style={[vars(themeToVars(theme)), { flex: 1, minHeight: 0 }]}
          testID={testID}
        >
          <View className="flex-row items-center gap-3 px-4 pb-2">
            {title ? (
              <Typography.Text
                accessibilityRole="header"
                className="flex-1 text-text-primary"
                semibold
                variant="subtitle"
              >
                {title}
              </Typography.Text>
            ) : (
              <View className="flex-1" />
            )}
            <Pressable
              accessibilityLabel="Cerrar"
              accessibilityRole="button"
              accessibilityState={{ disabled: !dismissible }}
              disabled={!dismissible}
              onPress={close}
              style={{
                minHeight: 48,
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography.Text
                className={dismissible ? "text-text-accent" : "text-text-disabled"}
                variant="bodySmall"
              >
                Cerrar
              </Typography.Text>
            </Pressable>
          </View>
          {scrollable ? (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1, minHeight: 0 }}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, minHeight: 0, paddingHorizontal: 16 }}>{children}</View>
          )}
          {footer ? (
            <View className="border-t border-border-light px-4 py-3">{footer}</View>
          ) : null}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default Sheet;
