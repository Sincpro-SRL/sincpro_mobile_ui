import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import CopyableText from "@sincpro/mobile-ui/Display/Display.CopyableText";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import ErrorState from "@sincpro/mobile-ui/Feedback/Feedback.Error";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/UX/Interaction contracts",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const ActionHierarchy: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Acciones con intención</Typography.Heading>
      <Typography.Text>
        La acción principal destaca. Las alternativas y la acción destructiva no compiten con
        ella.
      </Typography.Text>
      <Button accessibleSizing title="Guardar cambios" />
      <Button accessibleSizing title="Cancelar edición" variant="secondary" />
      <Button accessibleSizing title="Ver historial" variant="link" />
      <Button accessibleSizing title="Eliminar registro" variant="outlineDanger" />
    </View>
  ),
};

export const BusyAndDisabled: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Estados de la acción</Typography.Heading>
      <Typography.Text>
        Durante una operación no se puede activarla de nuevo. Un requisito pendiente se
        explica fuera del botón.
      </Typography.Text>
      <Button accessibleSizing loading title="Guardando cambios" />
      <Button accessibleSizing disabled title="Continuar" />
      <Typography.Text>Completa los campos obligatorios para continuar.</Typography.Text>
    </View>
  ),
};

function EmptyExample() {
  const [created, setCreated] = useState(false);
  return created ? (
    <Typography.Text accessibilityLiveRegion="polite">Primer registro creado</Typography.Text>
  ) : (
    <EmptyState
      accessibleSizing
      actionLabel="Crear primer registro"
      description="Los registros que crees aparecerán aquí."
      onAction={() => setCreated(true)}
      title="Todavía no hay registros"
    />
  );
}

export const Empty: Story = { render: () => <EmptyExample /> };

function ErrorExample() {
  const [loaded, setLoaded] = useState(false);
  return loaded ? (
    <Typography.Text accessibilityLiveRegion="polite">Información cargada</Typography.Text>
  ) : (
    <ErrorState
      accessibleSizing
      message="No se pudo cargar la información. Puedes volver a intentarlo."
      onRetry={() => setLoaded(true)}
    />
  );
}

export const RecoverableFailure: Story = { render: () => <ErrorExample /> };

export const CopyFailure: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Copia con error explícito</Typography.Heading>
      <Typography.Text>
        Este ejemplo provoca un error deliberado al resolver el valor. La acción comunica el
        fallo, no un éxito ficticio.
      </Typography.Text>
      <CopyableText
        getValue={() => {
          throw new Error("Fallo deliberado de la story");
        }}
        label="Copiar referencia"
      />
    </View>
  ),
};

export const ShortAndLongText: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Typography.Heading variant="h3">Datos y texto seleccionable</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        Una referencia corta se copia al tocar el dato. Una descripción permite seleccionar un
        fragmento; el icono copia el texto completo. El check confirma sin mover la pantalla.
      </Typography.Text>
      <CopyableText accessibilityLabel="Copiar referencia" value="REF-001" />
      <CopyableText
        accessibilityLabel="Copiar descripción"
        selectable
        value="Esta descripción es lo bastante larga para que sea útil seleccionar solo una parte, en vez de copiar automáticamente todo el contenido al tocarlo."
      />
    </View>
  ),
};
