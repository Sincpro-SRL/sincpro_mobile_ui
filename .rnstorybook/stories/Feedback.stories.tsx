import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { Form } from "@sincpro/mobile-ui/Form";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/Feedback" };
export default meta;

type Story = StoryObj;

export const Loading: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Feedback.Loading message="Cargando tickets..." />
    </View>
  ),
};

export const LoadingDots: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Feedback.Loading message="Cargando tickets..." variant="dots" />
    </View>
  ),
};

export const LoadingRipple: Story = {
  render: () => (
    <View style={{ height: 200 }}>
      <Feedback.Loading message="Cargando tickets..." variant="ripple" />
    </View>
  ),
};

export const Spinner: Story = {
  render: () => <Feedback.Spinner />,
};

export const SpinnerDots: Story = {
  render: () => <Feedback.Spinner variant="dots" />,
};

export const SpinnerRipple: Story = {
  render: () => <Feedback.Spinner variant="ripple" />,
};

export const SpinnerSizes: Story = {
  render: () => (
    <View style={{ gap: 24, alignItems: "center" }}>
      <View style={{ gap: 8, alignItems: "center" }}>
        <Typography.Text variant="caption">dots · small</Typography.Text>
        <Feedback.Spinner size="small" variant="dots" />
      </View>
      <View style={{ gap: 8, alignItems: "center" }}>
        <Typography.Text variant="caption">dots · large</Typography.Text>
        <Feedback.Spinner size="large" variant="dots" />
      </View>
      <View style={{ gap: 8, alignItems: "center" }}>
        <Typography.Text variant="caption">ripple · small</Typography.Text>
        <Feedback.Spinner size="small" variant="ripple" />
      </View>
      <View style={{ gap: 8, alignItems: "center" }}>
        <Typography.Text variant="caption">ripple · large</Typography.Text>
        <Feedback.Spinner size="large" variant="ripple" />
      </View>
    </View>
  ),
};

export const Empty: Story = {
  render: () => (
    <View style={{ height: 220 }}>
      <Feedback.Empty />
    </View>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <View style={{ height: 320 }}>
      <Feedback.Error
        message="No se pudo cargar la información"
        onHome={() => {}}
        onRetry={() => {}}
      />
    </View>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Feedback.Skeleton circle height={48} width={48} />
        <View style={{ flex: 1, gap: 8 }}>
          <Feedback.Skeleton height={14} width="70%" />
          <Feedback.Skeleton height={12} width="40%" />
        </View>
      </View>
      <Feedback.Skeleton height={120} radius={12} />
    </View>
  ),
};

export const Progress: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">25%</Typography.Text>
        <Feedback.Progress value={0.25} />
      </View>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">70%</Typography.Text>
        <Feedback.Progress value={0.7} />
      </View>
      <View style={{ gap: 4 }}>
        <Typography.Text className="text-text-secondary text-xs">
          Indeterminado
        </Typography.Text>
        <Feedback.Progress indeterminate />
      </View>
    </View>
  ),
};

export const Banner: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Feedback.Banner message="Mensaje informativo." title="Info" tone="info" />
      <Feedback.Banner message="Operación exitosa." title="Listo" tone="success" />
      <Feedback.Banner message="Revisá los datos." title="Atención" tone="warning" />
      <Feedback.Banner
        message="No se pudo completar."
        onClose={() => {}}
        title="Error"
        tone="danger"
      />
      <Feedback.Banner
        action={<Form.Button onPress={() => {}} size="small" title="Actualizar" />}
        message="Hay una nueva versión disponible. Actualizá para obtener las últimas mejoras y correcciones de esta pantalla."
        title="Actualización disponible"
        tone="info"
      />
    </View>
  ),
};

export const ProgressCircle: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Feedback.ProgressCircle value={0.25} />
      <Feedback.ProgressCircle size={80} value={0.6}>
        <Typography.Text semibold variant="body">
          60%
        </Typography.Text>
      </Feedback.ProgressCircle>
      <Feedback.ProgressCircle value={1} />
    </View>
  ),
};

export const EmptyStateRich: Story = {
  render: () => (
    <View style={{ height: 420 }}>
      <Feedback.EmptyState
        actionLabel="Explorar productos"
        description="Cuando agregues productos aparecerán acá."
        icon="cart-outline"
        onAction={() => {}}
        title="Tu carrito está vacío"
      />
    </View>
  ),
};

export const PermissionCard: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Feedback.PermissionCard
        actionLabel="Permitir ubicación"
        description="La usamos para mostrarte locales cercanos."
        granted={false}
        icon="location"
        onRequest={() => {}}
        title="Ubicación"
      />
      <Feedback.PermissionCard granted icon="notifications" title="Notificaciones" />
    </View>
  ),
};
