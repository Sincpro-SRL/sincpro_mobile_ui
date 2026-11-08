import { Actions } from "@sincpro/mobile-ui/Actions";
import { Toast, ToastProvider, useToast } from "@sincpro/mobile-ui/Feedback";
import { Typography } from "@sincpro/mobile-ui/Typography";
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

function Label({ children }: { children: string }) {
  return (
    <Typography.Text className="text-text-tertiary mt-3" variant="captionSmall">
      {children}
    </Typography.Text>
  );
}

function ToastButtons() {
  const toast = useToast();

  // Persistent loading toast that updates with progress and ends in success — the app wires
  // this to its EventBus/cron. Persistent toasts get a ✕ automatically.
  const processQueue = async () => {
    const total = 3;
    const id = toast.loading(`Procesando 1/${total}…`);
    for (let i = 1; i <= total; i++) {
      await wait(700);
      if (i < total) toast.update(id, { message: `Procesando ${i + 1}/${total}…` });
      else
        toast.update(id, { message: "Cola completada", variant: "success", duration: 3000 });
    }
  };

  // Sin id → cada una es una tarjeta nueva (se apilan).
  const stackThree = () => [1, 2, 3].forEach((n) => toast.info(`Notificación #${n}`));

  // Mismo id → se consolida en una sola tarjeta que se actualiza (no se apila).
  const consolidateThree = () =>
    [1, 2, 3].forEach((n) =>
      toast.info(`Actualización ${n}/3`, { id: "demo-consolidate", title: "Sincronizando" }),
    );

  return (
    <View style={{ gap: 10 }}>
      <Label>Variantes</Label>
      <Actions.Button
        onPress={() => toast.success("Guardado correctamente")}
        title="Success"
      />
      <Actions.Button
        onPress={() => toast.info("Información útil")}
        title="Info"
        variant="secondary"
      />
      <Actions.Button
        onPress={() => toast.warning("Revisá los datos")}
        title="Warning"
        variant="outline"
      />
      <Actions.Button
        onPress={() => toast.danger("Algo salió mal")}
        title="Danger"
        variant="outlineDanger"
      />

      <Label>Acción (botón dentro del toast)</Label>
      <Actions.Button
        onPress={() =>
          toast.show({
            action: { label: "Deshacer", onPress: () => toast.success("Restaurado") },
            message: "Se movió a la papelera",
            title: "Archivo eliminado",
            variant: "info",
          })
        }
        title="Con acción 'Deshacer'"
      />

      <Label>Cerrable (✕)</Label>
      <Actions.Button
        onPress={() =>
          toast.show({ dismissible: true, message: "Tocá la ✕ para cerrar", variant: "info" })
        }
        title="Cerrable (dismissible)"
        variant="secondary"
      />
      <Actions.Button
        onPress={() => toast.loading("Persistente — se cierra con ✕")}
        title="Loading persistente (✕ automática)"
        variant="secondary"
      />

      <Label>Apilar vs consolidar</Label>
      <Actions.Button onPress={stackThree} title="Apilar 3 (sin id)" variant="outline" />
      <Actions.Button
        onPress={consolidateThree}
        title="Consolidar 3 (mismo id)"
        variant="outline"
      />

      <Label>Async</Label>
      <Actions.Button
        onPress={() =>
          toast.promise(wait(1500), {
            error: "No se pudo guardar",
            loading: "Guardando…",
            success: "Guardado ✓",
          })
        }
        title="promise() — cargando → éxito"
        variant="cta"
      />
      <Actions.Button
        onPress={processQueue}
        title="Cola de ejecución (3 ítems)"
        variant="cta"
      />

      <Label>Contenido compuesto</Label>
      <Actions.Button
        onPress={() =>
          toast.show({
            render: ({ dismiss, update }) => (
              <>
                <Toast.Icon variant="loading" />
                <Toast.Content>
                  <Toast.Title>Actualizando catálogo</Toast.Title>
                  <Toast.Description>Descargando imágenes y precios…</Toast.Description>
                </Toast.Content>
                <Toast.Action
                  label="Listo"
                  onPress={() => update({ message: "La descarga continúa en segundo plano" })}
                />
                <Toast.Close onPress={dismiss} />
              </>
            ),
            variant: "loading",
          })
        }
        title="Toast compuesto y actualizable"
        variant="secondary"
      />
    </View>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <View style={{ flex: 1, justifyContent: "center", minHeight: 620 }}>
        <ToastButtons />
      </View>
    </ToastProvider>
  ),
};

export const TopPosition: Story = {
  render: () => (
    <ToastProvider position="top">
      <View style={{ flex: 1, justifyContent: "center", minHeight: 620 }}>
        <ToastButtons />
      </View>
    </ToastProvider>
  ),
};
