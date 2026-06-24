/**
 * Patterns/Profile — recetas de composición para pantallas de perfil.
 *
 * Estas stories NO son componentes importables — muestran cómo combinar
 * primitivos del DS (Display.Card, Display.Avatar, Navigation.MenuSection,
 * Display.MenuButton, Typography) para construir una pantalla de perfil.
 * Cada app replica esta composición con sus propios datos.
 *
 * Tipografía:
 *   - Nombre:            h5      (Satoshi / Inter semibold)
 *   - Email / IDs:       caption (Fira Code)
 *   - Valores numéricos: data    (Fira Code Medium)
 */
import { Display } from "@sincpro/mobile-ui/Display";
import BoxIcon from "@sincpro/mobile-ui/icons/BoxIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Templates/Profile" };
export default meta;
type Story = StoryObj;

// ─── ProfileHero ──────────────────────────────────────────────────────────────
// Receta: avatar + nombre + email sobre Display.Card.
// No existe Display.ProfileHero — esta composición va en la app.
export const ProfileHero: Story = {
  name: "ProfileHero (receta)",
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

// ─── ProfileFields ────────────────────────────────────────────────────────────
// Receta: tabla de datos clave-valor dentro de Display.Card.
// Labels → caption (Fira Code, secundario). Valores numéricos → data.
export const ProfileFields: Story = {
  name: "ProfileFields (receta)",
  render: () => (
    <Display.Card padding="none">
      <View className="p-4 gap-2">
        {[
          { label: "Email", value: "mariana@sincpro.com.bo", variant: "caption" as const },
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
  ),
};

// ─── FullProfile ──────────────────────────────────────────────────────────────
// Receta completa: hero + fields + Navigation.MenuSection con MenuButton.
// Esta es la plantilla de referencia para armar una pantalla de perfil.
function FullProfileStory() {
  const [debug, setDebug] = useState(false);

  return (
    <View style={{ gap: 0 }}>
      {/* Hero + datos en un solo card */}
      <View style={{ marginBottom: 16 }}>
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
      </View>

      {/* Menú de ajustes — usa Navigation.MenuSection (componente real) */}
      <Navigation.MenuSection title="Cuenta">
        <Display.MenuButton
          description="Configuración de la aplicación"
          icon={SettingsIcon}
          label="Ajustes"
          onPress={() => {}}
        />
        <Display.MenuButton
          icon={HomeIcon}
          label="Modo debug"
          toggle={{ value: debug, onToggle: setDebug }}
        />
        {debug ? (
          <Display.MenuButton
            description="Explorar datos locales"
            icon={BoxIcon}
            label="Base de datos"
            onPress={() => {}}
            showDivider={false}
          />
        ) : null}
      </Navigation.MenuSection>

      {/* Acción destructiva — siempre al final, en su propia sección */}
      <Navigation.MenuSection>
        <Display.MenuButton
          icon={ProfileIcon}
          label="Cerrar sesión"
          onPress={() => {}}
          showDivider={false}
          variant="danger"
        />
      </Navigation.MenuSection>
    </View>
  );
}

export const FullProfile: Story = {
  name: "FullProfile (receta)",
  render: () => <FullProfileStory />,
};
