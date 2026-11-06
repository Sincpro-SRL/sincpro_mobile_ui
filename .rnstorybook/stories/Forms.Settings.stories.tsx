import ActionSheet from "@sincpro/mobile-ui/Dialog/Dialog.ActionSheet";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import ListGroup from "@sincpro/mobile-ui/Display/Display.ListGroup";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/Forms/Settings",
  excludeStories: ["GroupedSettings"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export function GroupedSettings({
  long = false,
  customized = false,
}: {
  long?: boolean;
  customized?: boolean;
}) {
  const theme = useTheme();
  const [language, setLanguage] = useState("Español");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={{ gap: 24 }}>
      <Typography.Heading variant="h3">Preferencias</Typography.Heading>
      <ListGroup
        contentClassName={customized ? "rounded-lg bg-bg-muted" : undefined}
        footer="Estos ajustes pertenecen a esta demostración."
        testID="preferences-group"
        title="Tu espacio"
      >
        <ListItem
          leading={
            <View
              accessibilityElementsHidden
              className="rounded-full bg-container-accent p-2"
              importantForAccessibility="no-hide-descendants"
            >
              <Icon color={theme.container.onAccent} name="person-outline" size={20} />
            </View>
          }
          subtitle={
            long
              ? "Un nombre descriptivo que identifica tu espacio de trabajo sin ocultar información importante"
              : "Espacio de trabajo"
          }
          title="Sincpro"
          variant="mobile"
        />
        <ListItem
          accessibilityLabel="Cambiar idioma"
          chevron
          onPress={() => setLanguageOpen(true)}
          subtitle="Idioma de la interfaz"
          title="Idioma"
          value={language}
          variant="mobile"
        />
      </ListGroup>
      <ListGroup
        description="Elige cómo recibir avisos."
        footer="Puedes cambiarlo en cualquier momento."
        surface={customized ? "plain" : "inset"}
        testID="notifications-group"
        title="Notificaciones"
      >
        <ListItem
          subtitle={
            notifications ? "Los avisos están activados" : "Los avisos están desactivados"
          }
          title={
            long
              ? "Avisos importantes y recordatorios de tus tareas pendientes"
              : "Avisos importantes"
          }
          trailing={
            <Checkbox
              accessibilityLabel="Recibir avisos importantes"
              accessibleSizing
              className="min-w-[48px]"
              isChecked={notifications}
              onCheck={setNotifications}
            />
          }
          variant="mobile"
        />
        <ListItem
          accessibilityLabel="Resumen semanal no disponible"
          disabled
          onPress={() => setNotifications(true)}
          subtitle="Disponible próximamente"
          title="Resumen semanal"
          variant="mobile"
        />
      </ListGroup>
      <ActionSheet
        actions={["Español", "English"].map((label) => ({
          label,
          onPress: () => setLanguage(label),
        }))}
        onClose={() => setLanguageOpen(false)}
        title="Idioma de la interfaz"
        visible={languageOpen}
      />
    </View>
  );
}

export const Default: Story = { render: () => <GroupedSettings /> };
export const LongContent: Story = { render: () => <GroupedSettings long /> };
export const Customized: Story = { render: () => <GroupedSettings customized /> };

export const ReadingHierarchy: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <Typography.Heading variant="h3">Jerarquía de lectura</Typography.Heading>
      <Typography.Text variant="bodyReadable">
        Texto principal a 17 puntos: conserva la fuente de marca y la escala del sistema.
      </Typography.Text>
      <Typography.Text className="text-text-secondary" variant="bodyLarge">
        Ayuda secundaria a 16 puntos; no compite con el contenido.
      </Typography.Text>
      <Typography.Text variant="caption">
        REF-001 · metadatos en la familia mono de Sincpro
      </Typography.Text>
      <Typography.Text variant="body">
        El body legacy conserva sus 14 puntos. Las pantallas existentes no cambian.
      </Typography.Text>
    </View>
  ),
};
