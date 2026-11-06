import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import NativeSheet from "@sincpro/mobile-ui/Dialog/Dialog.NativeSheet";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Card from "@sincpro/mobile-ui/Display/Display.Card";
import KeyValue from "@sincpro/mobile-ui/Display/Display.KeyValue";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import Banner from "@sincpro/mobile-ui/Feedback/Feedback.Banner";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import Select from "@sincpro/mobile-ui/Form/Form.Select";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/UX/Mobile tasks",
  excludeStories: ["MobileRecords", "MobileSelection"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export function MobileRecords({ long = false }: { long?: boolean }) {
  const [archived, setArchived] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(false);
  const [completed, setCompleted] = useState(false);
  const title = long
    ? "Registro con una referencia descriptiva extensa que debe poder leerse en un teléfono con texto ampliado"
    : "Registro de ejemplo";
  const filtered = pendingOnly && completed;
  const hidden = archived || filtered;

  return (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Registros</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        Consulta el resumen o abre las acciones del registro. No necesitas descubrir un gesto.
      </Typography.Text>
      <Button
        accessibleSizing
        onPress={() => {
          setPendingDraft(pendingOnly);
          setFiltersOpen(true);
        }}
        title={pendingOnly ? "Filtros: solo pendientes" : "Filtrar registros"}
        variant="secondary"
      />
      {archived ? (
        <Banner
          action={
            <Button
              accessibleSizing
              onPress={() => setArchived(false)}
              title="Deshacer archivo"
              variant="link"
            />
          }
          message="Registro archivado. Puedes deshacer esta acción."
          tone="info"
        />
      ) : null}
      {hidden ? (
        <EmptyState
          description={
            filtered
              ? "No hay registros que coincidan. Puedes cambiar los filtros."
              : "Puedes recuperar el registro con Deshacer."
          }
          title={filtered ? "Sin resultados" : "Lista vacía"}
        />
      ) : (
        <Card padding="none">
          <View className="flex-row items-center">
            <ListItem
              accessibilityLabel="Abrir resumen del registro"
              accessibleSizing
              className="flex-1"
              onPress={() => setSummaryOpen(true)}
              showDivider={false}
              subtitle={completed ? "Completado · REF-001" : "Pendiente · REF-001"}
              title={title}
            />
            <IconButton
              accessibilityLabel="Opciones del registro"
              accessibleSizing
              icon="more-horizontal"
              onPress={() => setActionsOpen(true)}
            />
          </View>
        </Card>
      )}
      <ActionSheet
        actions={[
          {
            label: completed ? "Marcar como pendiente" : "Marcar como completado",
            onPress: () => setCompleted(!completed),
          },
          { label: "Archivar registro", destructive: true, onPress: () => setArchived(true) },
        ]}
        onClose={() => setActionsOpen(false)}
        title="Opciones del registro"
        visible={actionsOpen}
      />
      <Sheet
        accessibleSizing
        onClose={() => setFiltersOpen(false)}
        showCloseButton
        title="Filtrar registros"
        visible={filtersOpen}
      >
        <View style={{ gap: 16 }}>
          <Checkbox
            accessibleSizing
            isChecked={pendingDraft}
            mainText="Solo pendientes"
            onCheck={setPendingDraft}
          />
          <Typography.Text variant="bodyLarge">
            Los cambios se aplican al confirmar. Cerrar mantiene los filtros anteriores.
          </Typography.Text>
          <Button
            accessibleSizing
            onPress={() => {
              setPendingOnly(pendingDraft);
              setFiltersOpen(false);
            }}
            title="Aplicar filtros"
          />
        </View>
      </Sheet>
      <NativeSheet
        onClose={() => setSummaryOpen(false)}
        title="Resumen del registro"
        visible={summaryOpen}
      >
        <View style={{ gap: 12 }}>
          <KeyValue align="stacked" label="Nombre" selectable value={title} />
          <KeyValue align="auto" copyable label="Referencia" value="REF-001" />
          <KeyValue
            align="auto"
            label="Estado"
            value={completed ? "Completado" : "Pendiente"}
          />
          <Typography.Text variant="bodyLarge">
            Esta hoja usa presentación nativa de Expo 58. El contenido conserva los tokens de
            marca; cerrar vuelve a la lista.
          </Typography.Text>
        </View>
      </NativeSheet>
    </View>
  );
}

export function MobileSelection({ long = false }: { long?: boolean }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <View style={{ gap: 16 }}>
      <Typography.Heading variant="h3">Preferencias</Typography.Heading>
      <Typography.Text variant="bodyLarge">
        La selección se abre en una hoja inferior, no en un desplegable de escritorio.
      </Typography.Text>
      <Select
        accessibleSizing
        label="Canal de aviso"
        onChange={setValue}
        options={[
          { label: "Correo electrónico", value: "email" },
          {
            label: long
              ? "Notificación en el teléfono para avisos importantes y recordatorios de tareas pendientes"
              : "Notificación en el teléfono",
            value: "notification",
          },
        ]}
        title="Elegir canal de aviso"
        value={value}
      />
      <Typography.Text accessibilityLiveRegion="polite" variant="bodyLarge">
        {value
          ? `Canal elegido: ${value === "email" ? "Correo electrónico" : "Notificación en el teléfono"}`
          : "No has elegido un canal."}
      </Typography.Text>
    </View>
  );
}

export const Records: Story = { render: () => <MobileRecords /> };
export const LongRecords: Story = { render: () => <MobileRecords long /> };
export const Selection: Story = { render: () => <MobileSelection /> };
export const LongSelection: Story = { render: () => <MobileSelection long /> };
