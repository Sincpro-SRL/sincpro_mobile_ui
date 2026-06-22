import { ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";
import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/Feedback/Toast" };
export default meta;

type Story = StoryObj;

function wait(ms: number, fail = false) {
  return new Promise<string>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("error")) : resolve("ok")), ms),
  );
}

function ToastButtons() {
  const toast = useToast();

  // Patrón "escucha una cola de ejecución": un loading toast persistente que se
  // actualiza con el avance y termina en éxito. La app conecta esto a su EventBus/cron.
  const processQueue = async () => {
    const total = 3;
    const id = toast.loading(`Procesando 1/${total}…`);
    for (let i = 1; i <= total; i++) {
      await wait(700);
      if (i < total) toast.update(id, { message: `Procesando ${i + 1}/${total}…` });
      else
        toast.update(id, {
          message: "Cola completada",
          variant: "success",
          duration: 3000,
        });
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <Form.Button onPress={() => toast.success("Guardado correctamente")} title="Success" />
      <Form.Button
        onPress={() => toast.danger("Algo salió mal")}
        title="Danger"
        variant="outlineDanger"
      />
      <Form.Button
        onPress={() => toast.loading("Cargando datos…")}
        title="Loading (persistente)"
        variant="secondary"
      />
      <Form.Button
        onPress={() =>
          toast.promise(wait(1500), {
            loading: "Guardando…",
            success: "Guardado ✓",
            error: "No se pudo guardar",
          })
        }
        title="promise() — cargando → éxito"
        variant="outline"
      />
      <Form.Button onPress={processQueue} title="Cola de ejecución (3 ítems)" variant="cta" />
    </View>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <View style={{ flex: 1, justifyContent: "center", minHeight: 480 }}>
        <ToastButtons />
      </View>
    </ToastProvider>
  ),
};
