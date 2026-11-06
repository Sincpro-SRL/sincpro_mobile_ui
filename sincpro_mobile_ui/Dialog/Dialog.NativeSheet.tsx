import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { themeToVars, useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { vars } from "nativewind";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export interface NativeSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  testID?: string;
}

const SNAP_POINTS = ["60%", "90%"];

function NativeSheet({ visible, onClose, title, children, testID }: NativeSheetProps) {
  const theme = useTheme();

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: theme.bg.card }}
      enablePanDownToClose
      index={visible ? 0 : -1}
      onClose={() => {
        if (visible) onClose();
      }}
      snapPoints={SNAP_POINTS}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={[vars(themeToVars(theme)), { flex: 1, padding: 16 }]}
          testID={testID}
        >
          <View className="flex-row items-center gap-3">
            <Typography.Heading className="flex-1" variant="h4">
              {title}
            </Typography.Heading>
            <Pressable
              accessibilityLabel="Cerrar"
              onPress={onClose}
              style={{
                minHeight: 48,
                minWidth: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography.Text className="text-text-accent" variant="bodySmall">
                Cerrar
              </Typography.Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default NativeSheet;
