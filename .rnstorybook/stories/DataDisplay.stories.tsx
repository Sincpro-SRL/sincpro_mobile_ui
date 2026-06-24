import { Display } from "@sincpro/mobile-ui/Display";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";

const meta: Meta = { title: "Components/Data Display" };
export default meta;

type Story = StoryObj;

const PHOTO = { uri: "https://reactnative.dev/img/oss_logo.png" };

export const ImageWithFallback: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Display.Image aspectRatio={16 / 9} source={PHOTO} />
      <Display.Image
        height={80}
        source={{ uri: "https://invalid.example/x.png" }}
        width={80}
      />
    </View>
  ),
};

export const StatCards: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Display.StatCard delta={12.5} icon="cash-outline" label="Ventas" value="Bs 4.2k" />
      </View>
      <View style={{ flex: 1 }}>
        <Display.StatCard delta={-3.2} icon="cart-outline" label="Pedidos" value="128" />
      </View>
    </View>
  ),
};

const ROWS = [
  { producto: "Coca 2L", cant: 3, total: "Bs 30" },
  { producto: "Pan", cant: 12, total: "Bs 24" },
  { producto: "Leche", cant: 6, total: "Bs 42" },
];

export const DataTable: Story = {
  render: () => (
    <Display.DataTable
      columns={[
        { key: "producto", header: "Producto", flex: 2 },
        { key: "cant", header: "Cant.", align: "center" },
        { key: "total", header: "Total", align: "right" },
      ]}
      data={ROWS}
      footer={
        <>
          <View style={{ flex: 2 }}>
            <Typography.Text className="text-text-primary font-semibold" variant="bodySmall">
              Total
            </Typography.Text>
          </View>
          <View style={{ flex: 2 }}>
            <Typography.Text
              className="text-text-primary font-semibold text-right"
              variant="bodySmall"
            >
              Bs 96
            </Typography.Text>
          </View>
        </>
      }
      keyExtractor={(r) => r.producto}
    />
  ),
};

const PROMOS = [
  { id: "1", title: "2x1 en bebidas" },
  { id: "2", title: "Envío gratis" },
  { id: "3", title: "20% off" },
];

export const Carousel: Story = {
  render: () => (
    <Display.Carousel
      data={PROMOS}
      itemWidth={240}
      keyExtractor={(p) => p.id}
      renderItem={(p) => (
        <View className="bg-primary rounded-xl p-6 h-32 justify-end">
          <Typography.Text className="text-text-on-primary" semibold variant="subtitle">
            {p.title}
          </Typography.Text>
        </View>
      )}
    />
  ),
};

export const KeyValueList: Story = {
  render: () => (
    <View className="bg-bg-card rounded-lg px-4">
      <Display.KeyValue label="Pedido" value="#001234" />
      <Display.KeyValue label="Estado" value="En camino" />
      <Display.KeyValue label="Total" value="Bs 96,00" />
    </View>
  ),
};

export const SectionHeader: Story = {
  render: () => (
    <Display.SectionHeader
      action={{ label: "Ver todo", onPress: () => {} }}
      subtitle="Cerca de ti"
      title="Restaurantes"
    />
  ),
};

export const Timeline: Story = {
  render: () => (
    <Display.Timeline
      current={2}
      steps={[
        { title: "Pedido confirmado", description: "Recibimos tu pedido", time: "10:01" },
        {
          title: "En preparación",
          description: "El local lo está preparando",
          time: "10:08",
        },
        { title: "En camino", description: "Tu repartidor va hacia ti", time: "10:20" },
        { title: "Entregado", description: "¡Buen provecho!" },
      ]}
    />
  ),
};

export const TagsAndStats: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Display.Tag dotColor="#16A34A" label="Abierto" />
        <Display.Tag
          label="Envío gratis"
          leading={<Display.Icon name="bicycle" size={14} />}
        />
        <Display.Tag label="Vegano" />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Display.Stat label="Seguidores" value="1.2k" />
        <Display.Stat label="Siguiendo" value="340" />
        <Display.Stat label="Pedidos" value="89" />
      </View>
    </View>
  ),
};

export const Tooltip: Story = {
  name: "Tooltip — placements",
  render: () => (
    <View style={{ gap: 32, padding: 16 }}>
      <Typography.Text className="text-text-tertiary" variant="caption">
        Tocá cada icono para mostrar/ocultar el tooltip.
      </Typography.Text>

      <View style={{ gap: 12 }}>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {`placement="top" (default)`}
        </Typography.Text>
        <View style={{ paddingTop: 80, alignItems: "flex-start" }}>
          <Display.KeyValue
            label="Total a pagar"
            value={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Typography.Text className="text-text-primary" semibold>
                  Bs 96,00
                </Typography.Text>
                <Display.Tooltip content="Incluye impuestos y costo de envío estimados.">
                  <Display.Icon name="information-circle-outline" size={18} />
                </Display.Tooltip>
              </View>
            }
          />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {`placement="bottom"`}
        </Typography.Text>
        <Display.Tooltip
          content="El estado se actualiza cada 30 segundos automáticamente."
          placement="bottom"
          width={240}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Display.StatusDot status="online" />
            <Typography.Text className="text-text-primary">Conexión activa</Typography.Text>
            <Display.Icon
              className="text-text-tertiary"
              name="chevron-down-outline"
              size={14}
            />
          </View>
        </Display.Tooltip>
      </View>

      <View style={{ gap: 12 }}>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {`placement="right"`}
        </Typography.Text>
        <Display.Tooltip content="Campo obligatorio" placement="right" width={160}>
          <Display.Icon
            className="text-text-tertiary"
            name="alert-circle-outline"
            size={20}
          />
        </Display.Tooltip>
      </View>

      <View style={{ gap: 12 }}>
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {`placement="left"`}
        </Typography.Text>
        <View style={{ alignItems: "flex-end" }}>
          <Display.Tooltip
            content="Ver más opciones de configuración."
            placement="left"
            width={220}
          >
            <Display.Icon className="text-text-tertiary" name="settings-outline" size={20} />
          </Display.Tooltip>
        </View>
      </View>
    </View>
  ),
};

export const DateField: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Display.Date value={new Date().toISOString()} variant="withIcon" />
      <Display.Date
        relative
        value={new Date(Date.now() - 7200000).toISOString()}
        variant="pill"
      />
      <Display.KeyValue
        label="Creado"
        value={
          <Display.Date
            showTime={false}
            value={new Date().toISOString()}
            variant="withIcon"
          />
        }
      />
    </View>
  ),
};

export const Presence: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Display.StatusDot status="online" />
      <Display.StatusDot status="busy" />
      <Display.StatusDot status="away" />
      <Display.StatusDot status="offline" />
      <Display.StatusDot label="3 en línea" status="online" />
    </View>
  ),
};

export const IconBadge: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 24, alignItems: "center" }}>
      <Display.IconBadge count={3} onPress={() => {}}>
        <Display.Icon name="notifications-outline" size={26} />
      </Display.IconBadge>
      <Display.IconBadge count={128} onPress={() => {}}>
        <Display.Icon name="mail-outline" size={26} />
      </Display.IconBadge>
      <Display.IconBadge dot onPress={() => {}}>
        <Display.Icon name="cart-outline" size={26} />
      </Display.IconBadge>
    </View>
  ),
};
