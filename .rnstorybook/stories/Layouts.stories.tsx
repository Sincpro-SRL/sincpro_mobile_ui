import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import Container from "@sincpro/mobile-ui/layouts/Container";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = {
  title: "Components/Layout",
  parameters: { layout: "fullscreen", ownsScroll: true, ownsTopInset: true },
};
export default meta;

type Story = StoryObj;

function AuthTask() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <AuthContainer
      edges={["top"]}
      header={
        <Typography.Text style={{ color: "#FFFFFF" }} variant="h3">
          Bienvenido
        </Typography.Text>
      }
    >
      <Form.Input label="Nombre" onChangeText={setName} testID="layout-name" value={name} />
      <Form.Input
        autoCapitalize="none"
        keyboardType="email-address"
        label="Correo"
        onChangeText={setEmail}
        testID="layout-email"
        value={email}
      />
      <Actions.Button
        disabled={!name.trim() || !email.trim()}
        onPress={() => setSaved(true)}
        title="Continuar"
      />
      {saved ? (
        <Typography.Text>Datos preparados en esta demostración.</Typography.Text>
      ) : null}
    </AuthContainer>
  );
}

export const ContainerLayout: Story = {
  render: () => (
    <Container>
      <Navigation.AppBar title="Contenido" />
      <Typography.Text>
        El header reserva arriba; el contenedor solo los laterales.
      </Typography.Text>
    </Container>
  ),
};

export const Gradient: Story = {
  render: () => (
    <Display.GradientSurface className="p-6" preset="brand">
      <Typography.Text style={{ color: "#FFFFFF" }}>Superficie de marca</Typography.Text>
    </Display.GradientSurface>
  ),
};

export const Scroll: Story = {
  render: () => (
    <Container>
      <Navigation.AppBar title="Contenido desplazable" />
      <ScrollContainer>
        {Array.from({ length: 12 }, (_, index) => (
          <View className="bg-bg-muted p-4 my-1 rounded" key={index}>
            <Typography.Text>Fila {index + 1}</Typography.Text>
          </View>
        ))}
      </ScrollContainer>
    </Container>
  ),
};

export const Auth: Story = {
  parameters: { statusBarStyle: "light" },
  render: () => <AuthTask />,
};
