import { BottomSheet } from "@sincpro/mobile-ui/Dialog";
import { Form } from "@sincpro/mobile-ui/Form";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Legacy/Overlays" };
export default meta;

type Story = StoryObj;

// @deprecated — Dialog.BottomSheet custom (PanResponder, no se ancla bien).
// Reemplazado por Dialog.Sheet (gorhom). Se mantiene por retrocompat.
function BottomSheetDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Form.Button
        onPress={() => setVisible(true)}
        title="Abrir BottomSheet (deprecado)"
        variant="outline"
      />
      <BottomSheet.Root onClose={() => setVisible(false)} size="auto" visible={visible}>
        <BottomSheet.Header>
          <View className="px-5 pb-3">
            <Typography.Text bold variant="subtitle">
              Detalle
            </Typography.Text>
          </View>
        </BottomSheet.Header>
        <BottomSheet.Content>
          <View className="px-5 py-2">
            <Typography.Text>Contenido del bottom sheet.</Typography.Text>
          </View>
        </BottomSheet.Content>
        <BottomSheet.Actions>
          <View className="flex-1">
            <Form.Button onPress={() => setVisible(false)} title="Cerrar" variant="outline" />
          </View>
        </BottomSheet.Actions>
      </BottomSheet.Root>
    </View>
  );
}

export const BottomSheetCustom: Story = { render: () => <BottomSheetDemo /> };
