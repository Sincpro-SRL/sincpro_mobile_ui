import { Display } from "@sincpro/mobile-ui/Display";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Patterns/Headers" };
export default meta;

type Story = StoryObj;
const DEMO_LOGO = { uri: "https://reactnative.dev/img/tiny_logo.png" };

function HeaderTask() {
  const [detail, setDetail] = useState(true);
  return (
    <View style={{ gap: 16 }}>
      <Navigation.AppBar
        onBack={detail ? () => setDetail(false) : undefined}
        safeArea={false}
        subtitle={detail ? "Información del registro" : "Registros disponibles"}
        title={detail ? "Detalle" : "Inicio"}
      />
      <Typography.Text>
        {detail ? "Volver muestra Inicio." : "Inicio seleccionado."}
      </Typography.Text>
    </View>
  );
}

export const AppBar: Story = {
  render: () => <Navigation.AppBar safeArea={false} title="Registros" />,
};

export const BackNavigation: Story = {
  render: () => <HeaderTask />,
};

export const Branded: Story = {
  render: () => (
    <Navigation.AppBar
      background={{ surface: "brand" }}
      leading={<Display.Logo size="small" source={DEMO_LOGO} />}
      safeArea={false}
      subtitle="Identidad sin otro motor de cabeceras"
      title="Bienvenido"
    />
  ),
};

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Navigation.AppBar safeArea={false} subtitle="Cabecera compacta" title="Registros" />
      <Navigation.AppBar safeArea={false} title="Resumen" variant="large" />
      <Navigation.AppBar safeArea={false} title="Contenido" variant="center" />
    </View>
  ),
};
