import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import PinIcon from "@sincpro/mobile-ui/icons/PinIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import Container from "@sincpro/mobile-ui/layouts/Container";
import GradientContainer from "@sincpro/mobile-ui/layouts/GradientContainer";
import ScrollContainer from "@sincpro/mobile-ui/layouts/ScrollContainer";
import TabNavigatorLayout from "@sincpro/mobile-ui/layouts/TabNavigatorLayout";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Layout" };
export default meta;

type Story = StoryObj;

export const ContainerLayout: Story = {
  render: () => (
    <Container>
      <Typography.Text>Contenido dentro de Container</Typography.Text>
    </Container>
  ),
};

export const Gradient: Story = {
  render: () => (
    <GradientContainer className="p-6 rounded-lg">
      <Typography.Text className="text-text-inverse">GradientContainer</Typography.Text>
    </GradientContainer>
  ),
};

export const Scroll: Story = {
  render: () => (
    <ScrollContainer>
      {Array.from({ length: 12 }).map((_, i) => (
        <View className="bg-bg-muted p-4 my-1 rounded" key={i}>
          <Typography.Text>Fila {i + 1}</Typography.Text>
        </View>
      ))}
    </ScrollContainer>
  ),
};

export const Auth: Story = {
  render: () => (
    <View style={{ height: 640 }}>
      <AuthContainer
        header={
          <Typography.Text className="text-text-inverse" variant="h3">
            Bienvenido
          </Typography.Text>
        }
        onBackPress={() => {}}
      >
        <Typography.Text>Contenido del formulario sobre la hoja blanca.</Typography.Text>
      </AuthContainer>
    </View>
  ),
};

const TABS = [
  { path: "home", label: "Inicio", Icon: HomeIcon },
  { path: "routes", label: "Ruta", Icon: PinIcon },
  { path: "settings", label: "Ajustes", Icon: SettingsIcon },
  { path: "profile", label: "Perfil", Icon: ProfileIcon },
];

function TabNavigatorDemo() {
  const [current, setCurrent] = useState("home");
  return (
    <View style={{ height: 560 }}>
      <TabNavigatorLayout
        content={
          <View className="flex-1 items-center justify-center">
            <Typography.Text variant="h4">Tab activo: {current}</Typography.Text>
          </View>
        }
        currentPath={current}
        onTabPress={setCurrent}
      >
        <TabNavigatorLayout.Tabs>
          {TABS.map((t) => (
            <TabNavigatorLayout.Tab
              Icon={t.Icon}
              key={t.path}
              label={t.label}
              path={t.path}
            />
          ))}
        </TabNavigatorLayout.Tabs>
      </TabNavigatorLayout>
    </View>
  );
}

export const TabNavigator: Story = {
  render: () => <TabNavigatorDemo />,
};
