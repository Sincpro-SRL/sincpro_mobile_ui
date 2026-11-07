import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import DomainSplashScreen from "@sincpro/mobile-ui/Feedback/Feedback.DomainSplashScreen";
import Input from "@sincpro/mobile-ui/Form/Form.Input";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Patterns/Feedback/Loading lifecycle",
  parameters: { layout: "fullscreen", ownsScroll: true },
} satisfies Meta;
export default meta;
type Story = StoryObj;

function LoadingLifecycle({ customized = false }: { customized?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("Este borrador se conserva");
  const [completed, setCompleted] = useState(0);
  return (
    <View style={{ flex: 1, gap: 16, padding: 16 }}>
      <Typography.Text>
        La app decide cuándo termina la carga. Cambia Reducir movimiento en Ajustes para
        comprobar el comportamiento.
      </Typography.Text>
      <DomainSplashScreen
        domainName="Tu espacio"
        isLoading={loading}
        minDuration={1000}
        onComplete={() => setCompleted((count) => count + 1)}
        renderLoading={
          customized
            ? (state) => (
                <View className="flex-1 items-center justify-center bg-bg-muted p-6">
                  <Typography.Heading variant="h3">Tu diseño de carga</Typography.Heading>
                  <Typography.Text>
                    {state.isLoading ? "Esperando a la app" : "Preparado"}
                  </Typography.Text>
                  <Typography.Text>
                    {state.reducedMotion
                      ? "Sin movimiento decorativo"
                      : "Movimiento permitido"}
                  </Typography.Text>
                </View>
              )
            : undefined
        }
      >
        <Input label="Borrador" onChangeText={setDraft} value={draft} />
        <Typography.Text>{`Cargas completadas: ${completed}`}</Typography.Text>
      </DomainSplashScreen>
      <Button
        onPress={() => setLoading(!loading)}
        title={loading ? "Finalizar carga real" : "Volver a cargar"}
      />
    </View>
  );
}

export const ControlledLoading: Story = { render: () => <LoadingLifecycle /> };
export const CustomLoading: Story = { render: () => <LoadingLifecycle customized /> };
