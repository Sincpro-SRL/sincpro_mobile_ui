import { Actions } from "@sincpro/mobile-ui/Actions";
import { Dialog, useConfirmationContext } from "@sincpro/mobile-ui/Dialog";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Overlays" };
export default meta;

type Story = StoryObj;

function ConfirmationDemo() {
  const { show } = useConfirmationContext();
  return (
    <Actions.Button
      onPress={() =>
        show({
          title: "Eliminar ticket",
          message: "¿Seguro que deseas eliminar este ticket?",
          confirmText: "Eliminar",
          onConfirm: () => {},
        })
      }
      title="Mostrar confirmación"
    />
  );
}

function ActionSheetDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Actions.Button onPress={() => setVisible(true)} title="Abrir ActionSheet" />
      <Dialog.ActionSheet
        actions={[
          { label: "Editar", icon: "edit", onPress: () => {} },
          { label: "Compartir", icon: "share", onPress: () => {} },
          { label: "Eliminar", icon: "delete", destructive: true, onPress: () => {} },
        ]}
        message="Elegí una acción para el ticket"
        onClose={() => setVisible(false)}
        title="Ticket #001"
        visible={visible}
      />
    </View>
  );
}

function SheetDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <Actions.Button onPress={() => setVisible(true)} title="Abrir Sheet nativo" />
      <Dialog.Sheet
        onClose={() => setVisible(false)}
        title="Detalle del pedido"
        visible={visible}
      >
        <Typography.Text className="text-text-secondary">
          Sheet moderno con gestos, snap dinámico y backdrop. Deslizá hacia abajo para cerrar.
        </Typography.Text>
        <View style={{ height: 12 }} />
        <Actions.Button onPress={() => setVisible(false)} title="Cerrar" variant="outline" />
      </Dialog.Sheet>
    </View>
  );
}

export const Sheet: Story = { render: () => <SheetDemo /> };

export const ActionSheet: Story = { render: () => <ActionSheetDemo /> };

export const Confirmation: Story = { render: () => <ConfirmationDemo /> };
