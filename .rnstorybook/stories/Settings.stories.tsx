import { Display } from "@sincpro/mobile-ui/Display";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Switch, View } from "react-native";

const meta: Meta = { title: "Patterns/Settings" };
export default meta;

type Story = StoryObj;

function Leading({ name }: { name: string }) {
  return (
    <View
      className="items-center justify-center rounded-xl bg-bg-muted"
      style={{ width: 36, height: 36 }}
    >
      <Display.Icon color={theme.icon.primary} name={name} size={18} type="ionicons" />
    </View>
  );
}

// Composed from DS primitives only — SectionHeader + Card + ListItem. No bespoke component:
// this IS the "settings by section" pattern (single source of truth = ListItem + SectionHeader).
function SettingsScreenDemo() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={{ gap: 18, padding: 12 }}>
      <Typography.Text style={{ fontSize: 30, fontWeight: "800" }}>Ajustes</Typography.Text>

      {/* Account hero row */}
      <Display.Card padding="none">
        <Display.ListItem
          chevron
          leading={<Display.Avatar initials="MR" size={44} />}
          onPress={() => {}}
          showDivider={false}
          subtitle="Administrador · SINCPRO"
          title="Mariana Rojas"
        />
      </Display.Card>

      <View>
        <Display.SectionHeader title="Negocio" />
        <Display.Card padding="none">
          <Display.ListItem
            chevron
            leading={<Leading name="business-outline" />}
            onPress={() => {}}
            title="Sucursales"
          />
          <Display.ListItem
            chevron
            leading={<Leading name="pricetags-outline" />}
            onPress={() => {}}
            title="Impuestos"
          />
          <Display.ListItem
            chevron
            leading={<Leading name="card-outline" />}
            onPress={() => {}}
            showDivider={false}
            title="Métodos de pago"
          />
        </Display.Card>
      </View>

      <View>
        <Display.SectionHeader title="Aplicación" />
        <Display.Card padding="none">
          <Display.ListItem
            leading={<Leading name="notifications-outline" />}
            title="Notificaciones"
            trailing={
              <Switch
                onValueChange={setNotifications}
                thumbColor="#ffffff"
                trackColor={{ false: "#d1d5db", true: theme.primary }}
                value={notifications}
              />
            }
          />
          <Display.ListItem
            leading={<Leading name="sync-outline" />}
            showDivider={false}
            title="Sincronización"
            trailing={
              <Typography.Text className="text-text-tertiary" variant="bodySmall">
                Wi-Fi
              </Typography.Text>
            }
          />
        </Display.Card>
      </View>
    </View>
  );
}

export const SectionedMenu: Story = { render: () => <SettingsScreenDemo /> };
