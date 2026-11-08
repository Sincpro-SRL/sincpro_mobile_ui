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

/** Edit one value in a sheet: saves, keeps the draft on error and closes on success. */
function EditValueDemo() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("Ticket #001");
  return (
    <View style={{ gap: 12 }}>
      <Typography.Text>Nombre: {name}</Typography.Text>
      <Actions.Button onPress={() => setVisible(true)} title="Editar nombre" />
      <Dialog.EditValue
        onClose={() => setVisible(false)}
        onConfirm={async (next) => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setName(next);
        }}
        title="Nombre del ticket"
        value={name}
        visible={visible}
      />
    </View>
  );
}

/**
 * The system's own centered dialog (iOS UIAlertController / Android AlertDialog).
 * Use it for a short yes/no; use Confirmation when the dialog needs our look or
 * an async action with pending and error states.
 */
function NativeConfirmationDemo() {
  const [answer, setAnswer] = useState<string>("Sin respuesta");
  return (
    <View style={{ gap: 12 }}>
      <Actions.Button
        onPress={async () => {
          const confirmed = await Dialog.requestConfirmation({
            title: "Eliminar ticket",
            message: "¿Seguro que deseas eliminar este ticket?",
            confirmText: "Eliminar",
            destructive: true,
          });
          setAnswer(confirmed ? "Confirmado" : "Cancelado");
        }}
        title="Mostrar confirmación nativa"
      />
      <Typography.Text accessibilityLiveRegion="polite">{answer}</Typography.Text>
    </View>
  );
}

export const Sheet: Story = { render: () => <SheetDemo /> };

export const EditValue: Story = { render: () => <EditValueDemo /> };

export const NativeConfirmation: Story = { render: () => <NativeConfirmationDemo /> };

export const ActionSheet: Story = { render: () => <ActionSheetDemo /> };

export const Confirmation: Story = { render: () => <ConfirmationDemo /> };
