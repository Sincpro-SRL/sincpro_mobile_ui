import { setBranding } from "@sincpro/mobile-ui/branding";
import { Display } from "@sincpro/mobile-ui/Display";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { HomeHeader } from "@sincpro/mobile-ui/widgets/HomeHeader";
import ScreenHeader, { EVariantScreenHeader } from "@sincpro/mobile-ui/widgets/ScreenHeader";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Legacy/Headers" };
export default meta;

type Story = StoryObj;

// @deprecated — Navigation.Header (gradiente). Reemplazado por Navigation.AppBar.
export const NavHeader: Story = {
  render: () => <Navigation.Header title="Tickets" />,
};

export const NavHeaderWithBack: Story = {
  render: () => (
    <Navigation.Header backButton handleBackButton={() => {}} title="Detalle del ticket" />
  ),
};

// Placeholder remoto (ImageSourcePropType) — en la app real es require("../assets/<APP>/logo.png").
const DEMO_LOGO = { uri: "https://reactnative.dev/img/tiny_logo.png" };

export const ScreenHeaders: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">FLAT_HEADER</Typography.Text>
        <ScreenHeader
          onBack={() => {}}
          subtitle="Información del cliente"
          title="Juan Pérez"
          variant={EVariantScreenHeader.FLAT_HEADER}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">
          ROUNDED_HEADER
        </Typography.Text>
        <ScreenHeader
          onBack={() => {}}
          subtitle="Seleccione una orden"
          title="Órdenes"
          variant={EVariantScreenHeader.ROUNDED_HEADER}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">ONLY_LOGO</Typography.Text>
        <ScreenHeader
          logoSource={DEMO_LOGO}
          title="Caja"
          variant={EVariantScreenHeader.ONLY_LOGO}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">
          LOGO_WITH_BACK_BUTTON
        </Typography.Text>
        <ScreenHeader
          logoSource={DEMO_LOGO}
          onBack={() => {}}
          variant={EVariantScreenHeader.LOGO_WITH_BACK_BUTTON}
        />
      </View>
    </View>
  ),
};

export const Home: Story = {
  render: () => <HomeHeader logoSource={DEMO_LOGO} title="Tickets" />,
};

export const HomeWithBack: Story = {
  render: () => (
    <HomeHeader backButton logoSource={DEMO_LOGO} onBack={() => {}} title="Perfil" />
  ),
};

// Branding por contexto: setBranding una vez (en la app: createAppShell({ branding })) y
// Display.Logo / headers lo toman como fallback sin pasar source en cada pantalla.
export const BrandingFallback: Story = {
  render: () => {
    setBranding({ logo: DEMO_LOGO });
    return (
      <View style={{ gap: 16, alignItems: "center" }}>
        <Typography.Text className="text-text-secondary text-xs">
          setBranding({"{ logo }"}) → Display.Logo sin prop source
        </Typography.Text>
        <Display.Logo size="medium" />
        <ScreenHeader
          title="Sin logoSource (usa branding)"
          variant={EVariantScreenHeader.ONLY_LOGO}
        />
      </View>
    );
  },
};
