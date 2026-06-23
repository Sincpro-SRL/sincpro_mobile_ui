/**
 * Patterns/Profile — cómo componer pantallas de perfil y menús con el DS.
 *
 * Usa solo primitivos del DS: Display.Card, Display.Avatar, Display.MenuButton,
 * Display.ListItem, Display.SectionHeader, Typography. No hay componente "ProfileScreen"
 * en el DS — esta story es la referencia canónica para construirlo en cada app.
 *
 * Tipografía:
 *   - Nombre: h5 / Satoshi (o Inter semiBold si no está configurado)
 *   - Email/identificadores: caption / Fira Code
 *   - Labels de campo: caption / Fira Code
 *   - Valores numéricos (VAT, teléfono): data / Fira Code Medium
 */
import { Display } from "@sincpro/mobile-ui/Display";
import BoxIcon from "@sincpro/mobile-ui/icons/BoxIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Switch, View } from "react-native";

const meta: Meta = { title: "Patterns/Profile" };
export default meta;
type Story = StoryObj;

// ─── helpers ─────────────────────────────────────────────────────────────────

function SectionGap() {
  return <View style={{ height: 20 }} />;
}

// ─── ProfileHero — avatar + nombre + email ────────────────────────────────────
// Tipografía: h5 para nombre (Satoshi/Inter título), caption para email (Fira Code)
export const ProfileHero: Story = {
  render: () => (
    <Display.Card padding="none">
      <View className="flex-row items-center p-4 gap-3">
        <Display.Avatar initials="MR" size={52} />
        <View className="flex-1 gap-0.5">
          <Typography.Text semibold variant="h5">
            Mariana Rojas
          </Typography.Text>
          <Typography.Text className="text-text-secondary" variant="caption">
            mariana@sincpro.com.bo
          </Typography.Text>
          <Typography.Text className="text-text-tertiary" variant="caption">
            Administradora · SINCPRO
          </Typography.Text>
        </View>
      </View>
    </Display.Card>
  ),
};

// ─── ProfileFields — datos estructurados del usuario ─────────────────────────
// Labels → caption (Fira Code, secundario). Valores numéricos → data (Fira Code Medium).
export const ProfileFields: Story = {
  render: () => (
    <Display.Card padding="none">
      <View className="p-4 gap-2">
        <View className="flex-row items-center gap-2">
          <Typography.Text
            className="text-text-secondary"
            style={{ width: 88 }}
            variant="caption"
          >
            Email
          </Typography.Text>
          <Typography.Text className="flex-1 text-right" variant="caption">
            mariana@sincpro.com.bo
          </Typography.Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Typography.Text
            className="text-text-secondary"
            style={{ width: 88 }}
            variant="caption"
          >
            Teléfono
          </Typography.Text>
          <Typography.Text className="flex-1 text-right" variant="data">
            +591 70 123 456
          </Typography.Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Typography.Text
            className="text-text-secondary"
            style={{ width: 88 }}
            variant="caption"
          >
            VAT
          </Typography.Text>
          <Typography.Text className="flex-1 text-right" variant="data">
            4012345021
          </Typography.Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Typography.Text
            className="text-text-secondary"
            style={{ width: 88 }}
            variant="caption"
          >
            Ciudad
          </Typography.Text>
          <Typography.Text className="flex-1 text-right" variant="caption">
            Santa Cruz, Bolivia
          </Typography.Text>
        </View>
      </View>
    </Display.Card>
  ),
};

// ─── MenuSection — grupo de opciones con Display.MenuButton ───────────────────
// La forma canónica de armar menús en perfil/settings: Card + MenuButton apilados.
// showDivider=true (default) separa items; el último lleva showDivider=false.
function MenuSectionStory() {
  const [debug, setDebug] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      {/* Sección de cuenta */}
      <View>
        <Display.SectionHeader title="Cuenta" />
        <Display.Card padding="none">
          <Display.MenuButton
            description="Configuración de la aplicación"
            icon={SettingsIcon}
            label="Ajustes"
            onPress={() => {}}
          />
          <Display.MenuButton
            icon={ProfileIcon}
            label="Editar perfil"
            onPress={() => {}}
            showDivider={false}
          />
        </Display.Card>
      </View>

      {/* Sección de debug (solo visible en modo dev) */}
      <View>
        <Display.SectionHeader title="Desarrollador" />
        <Display.Card padding="none">
          <Display.MenuButton
            icon={HomeIcon}
            label="Modo debug"
            rightComponent={
              <Switch
                onValueChange={setDebug}
                style={{ transform: [{ scale: 0.85 }] }}
                thumbColor={theme.bg.card}
                trackColor={{ false: theme.bg.muted, true: theme.accent }}
                value={debug}
              />
            }
            showDivider={debug}
          />
          {debug && (
            <Display.MenuButton
              description="Explorar datos locales"
              icon={BoxIcon}
              label="Base de datos"
              onPress={() => {}}
              showDivider={false}
            />
          )}
        </Display.Card>
      </View>

      {/* Acción destructiva — siempre al final, sin divider */}
      <Display.Card padding="none">
        <Display.MenuButton
          icon={ProfileIcon}
          label="Cerrar sesión"
          onPress={() => {}}
          showDivider={false}
          variant="danger"
        />
      </Display.Card>
    </View>
  );
}

export const MenuSection: Story = { render: () => <MenuSectionStory /> };

// ─── FullProfile — pantalla de perfil completa ────────────────────────────────
// Combina hero + fields + menú. Esta es la plantilla de referencia para cualquier app.
function FullProfileStory() {
  const [debug, setDebug] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      {/* Hero */}
      <Display.Card padding="none">
        <View className="flex-row items-center p-4 gap-3">
          <Display.Avatar initials="MR" size={52} />
          <View className="flex-1 gap-0.5">
            <Typography.Text semibold variant="h5">
              Mariana Rojas
            </Typography.Text>
            <Typography.Text className="text-text-secondary" variant="caption">
              mariana@sincpro.com.bo
            </Typography.Text>
            <Typography.Text className="text-text-tertiary" variant="captionSmall">
              Administradora · SINCPRO
            </Typography.Text>
          </View>
        </View>

        <Display.Divider spacing="sm" />

        {/* Datos — labels Fira Code caption, valores data */}
        <View className="px-4 py-3 gap-2.5">
          {[
            { label: "Teléfono", value: "+591 70 123 456", variant: "data" as const },
            { label: "VAT", value: "4012345021", variant: "data" as const },
            { label: "Ciudad", value: "Santa Cruz, Bolivia", variant: "caption" as const },
          ].map(({ label, value, variant }) => (
            <View className="flex-row items-center" key={label}>
              <Typography.Text
                className="text-text-secondary"
                style={{ width: 88 }}
                variant="caption"
              >
                {label}
              </Typography.Text>
              <Typography.Text className="flex-1 text-right" variant={variant}>
                {value}
              </Typography.Text>
            </View>
          ))}
        </View>
      </Display.Card>

      <SectionGap />

      {/* Menú de cuenta */}
      <View>
        <Display.SectionHeader title="Cuenta" />
        <Display.Card padding="none">
          <Display.MenuButton
            description="Configuración de la aplicación"
            icon={SettingsIcon}
            label="Ajustes"
            onPress={() => {}}
          />
          <Display.MenuButton
            icon={HomeIcon}
            label="Modo debug"
            rightComponent={
              <Switch
                onValueChange={setDebug}
                style={{ transform: [{ scale: 0.85 }] }}
                thumbColor={theme.bg.card}
                trackColor={{ false: theme.bg.muted, true: theme.accent }}
                value={debug}
              />
            }
            showDivider={false}
          />
        </Display.Card>
      </View>

      {/* Logout — separado, siempre al final */}
      <Display.Card padding="none">
        <Display.MenuButton
          icon={ProfileIcon}
          label="Cerrar sesión"
          onPress={() => {}}
          showDivider={false}
          variant="danger"
        />
      </Display.Card>
    </View>
  );
}

export const FullProfile: Story = { render: () => <FullProfileStory /> };
