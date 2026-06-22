import { Form } from "@sincpro/mobile-ui/Form";
import { Typography } from "@sincpro/mobile-ui/Typography";
import AuthFormView from "@sincpro/mobile-ui/views/AuthFormView";
import FormViewV2 from "@sincpro/mobile-ui/views/FormViewV2";
import ListViewV2 from "@sincpro/mobile-ui/views/ListViewV2";
import { Wizard } from "@sincpro/mobile-ui/views/Wizard";
import { EVariantScreenHeader } from "@sincpro/mobile-ui/widgets/ScreenHeader";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Patterns/Views" };
export default meta;

type Story = StoryObj;

// Placeholder remoto (ImageSourcePropType) — en la app real es require("../assets/<APP>/logo.png").
const DEMO_LOGO = { uri: "https://reactnative.dev/img/tiny_logo.png" };

const tickets = [
  { id: "1", title: "Ticket #001 — Caja 1", subtitle: "Pendiente" },
  { id: "2", title: "Ticket #002 — Caja 2", subtitle: "En proceso" },
  { id: "3", title: "Ticket #003 — Caja 1", subtitle: "Cerrado" },
];

export const ListView: Story = {
  render: () => (
    <View style={{ height: 560 }}>
      <ListViewV2.Root
        description="Seleccione un ticket"
        items={tickets}
        name="Tickets"
        onBack={() => {}}
        onRefresh={async () => {}}
        onSearch={() => {}}
        withContainer={false}
      >
        <ListViewV2.Header variant={EVariantScreenHeader.ROUNDED_HEADER}>
          <ListViewV2.Header.Search />
        </ListViewV2.Header>
        <ListViewV2.Content>
          {(item) => (
            <View className="bg-bg-card p-4 border-b border-border-default">
              <Typography.Text semibold>{item.title}</Typography.Text>
              <Typography.Text className="text-text-secondary" variant="bodySmall">
                {item.subtitle}
              </Typography.Text>
            </View>
          )}
        </ListViewV2.Content>
      </ListViewV2.Root>
    </View>
  ),
};

export const FormView: Story = {
  render: () => (
    <View style={{ height: 560 }}>
      <FormViewV2.Root
        description="Balance y movimientos"
        item={{ balance: "Bs 1.250,00" }}
        name="Caja"
        onBack={() => {}}
        onRefresh={async () => {}}
        withContainer={false}
      >
        <FormViewV2.Header logoSource={DEMO_LOGO} variant={EVariantScreenHeader.ONLY_LOGO} />
        <FormViewV2.Content>
          <FormViewV2.Content.Groups>
            <FormViewV2.Content.Group>
              <View className="p-3 gap-1">
                <Typography.Text className="text-text-secondary" variant="bodySmall">
                  Balance
                </Typography.Text>
                <Typography.Text semibold variant="h4">
                  Bs 1.250,00
                </Typography.Text>
              </View>
            </FormViewV2.Content.Group>
            <FormViewV2.Content.Group>
              <View className="p-3 gap-1">
                <Typography.Text semibold>Último cobro</Typography.Text>
                <Typography.Text className="text-text-secondary" variant="bodySmall">
                  Ticket #014 — Bs 80,00
                </Typography.Text>
              </View>
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>
        <FormViewV2.Footer>
          <Form.Button title="Registrar cobro" variant="cta" />
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  ),
};

export const AuthForm: Story = {
  render: () => (
    <View style={{ height: 640 }}>
      <AuthFormView
        description="Ingresá tus credenciales"
        FormNode={
          <View className="gap-2">
            <Form.Input label="Usuario" placeholder="tu@correo.com" />
            <Form.Input label="Contraseña" placeholder="••••••••" secureTextEntry />
            <Form.Button title="Entrar" variant="primary" />
            <Form.Button title="Configurar servidor" variant="link" />
          </View>
        }
        logoSource={DEMO_LOGO}
        title="Iniciar sesión"
      />
    </View>
  ),
};

export const WizardFlow: Story = {
  render: () => (
    <View style={{ height: 420 }}>
      <Wizard.Root initialStep="overview" steps={["overview", "confirm"]}>
        <Wizard.Step name="overview">
          {(wizard) => (
            <View className="p-4 gap-3">
              <Typography.Text semibold variant="h4">
                Paso 1 — Resumen
              </Typography.Text>
              <Typography.Text className="text-text-secondary">
                Progreso: {Math.round(wizard.progress * 100)}%
              </Typography.Text>
              <Form.Button
                onPress={() => wizard.goToStep("confirm")}
                title="Siguiente"
                variant="cta"
              />
            </View>
          )}
        </Wizard.Step>
        <Wizard.Step name="confirm">
          {(wizard) => (
            <View className="p-4 gap-3">
              <Typography.Text semibold variant="h4">
                Paso 2 — Confirmar
              </Typography.Text>
              <Form.Button title="Confirmar" variant="primary" />
              <Form.Button onPress={() => wizard.back()} title="Atrás" variant="outline" />
            </View>
          )}
        </Wizard.Step>
      </Wizard.Root>
    </View>
  ),
};
