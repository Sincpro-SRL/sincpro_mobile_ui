import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import type { ReactNode } from "react";
import { View } from "react-native";

const meta = {
  title: "Foundations/Typography",
  component: Typography.Text,
  args: {
    children: "El veloz murciélago hindú",
    variant: "body",
  },
} satisfies Meta<typeof Typography.Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Body: Story = {};
export const Heading: Story = { args: { children: "Título", variant: "h3", bold: true } };
export const Caption: Story = {
  args: { children: "22 jun 2026 · 14:32 · SKU-00917", variant: "caption" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 3 }}>
      <Typography.Text className="text-text-tertiary" variant="overline">
        {label}
      </Typography.Text>
      {children}
    </View>
  );
}

function Divider({ title }: { title: string }) {
  return (
    <View style={{ gap: 6, paddingTop: 8 }}>
      <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)" }} />
      <Typography.Text className="text-text-muted" variant="overline">
        {title}
      </Typography.Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Roles — muestra las 3 familias del DS con contenido real
// ─────────────────────────────────────────────────────────────────────────────

export const Roles: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      {/* ── SATOSHI (título de marca) ─────────────────────────────── */}
      <Divider title="Satoshi · roles de título" />

      <Row label="display · 48 / Black">
        <Typography.Text variant="display">Sincpro</Typography.Text>
      </Row>
      <Row label="h1 · 32 / Black">
        <Typography.Text variant="h1">Gestión</Typography.Text>
      </Row>
      <Row label="h2 · 28 / Bold">
        <Typography.Text variant="h2">Resumen de ventas</Typography.Text>
      </Row>
      <Row label="h3 · 24 / Bold">
        <Typography.Text variant="h3">Pedidos del día</Typography.Text>
      </Row>

      {/* ── INTER (UI / body) ────────────────────────────────────── */}
      <Divider title="Inter · roles de UI y cuerpo" />

      <Row label="h4 · 20 / Medium">
        <Typography.Text variant="h4">Inventario general</Typography.Text>
      </Row>
      <Row label="h5 · 18 / Medium">
        <Typography.Text variant="h5">Clientes activos</Typography.Text>
      </Row>
      <Row label="h6 · 16 / Medium">
        <Typography.Text variant="h6">Detalles del pedido</Typography.Text>
      </Row>
      <Row label="bodyLarge · 16 / Regular">
        <Typography.Text variant="bodyLarge">
          El veloz murciélago hindú comía feliz cardillo y kiwi.
        </Typography.Text>
      </Row>
      <Row label="body · 14 / Regular">
        <Typography.Text variant="body">
          Descripción del producto. Precio sujeto a cambios sin previo aviso.
        </Typography.Text>
      </Row>
      <Row label="bodySmall · 13 / Regular">
        <Typography.Text variant="bodySmall">
          Nota: incluye IGV y descuentos aplicados.
        </Typography.Text>
      </Row>
      <Row label="label · 14 / Medium + tracking">
        <Typography.Text variant="label">Categoría de producto</Typography.Text>
      </Row>
      <Row label="labelSmall · 13 / Medium + tracking">
        <Typography.Text variant="labelSmall">Estado del pedido</Typography.Text>
      </Row>
      <Row label="subtitle · 18 / Medium (legacy)">
        <Typography.Text semibold variant="subtitle">
          Subtotal de la orden
        </Typography.Text>
      </Row>
      <Row label="button · 14 / SemiBold + tracking">
        <Typography.Text variant="button">Confirmar pedido</Typography.Text>
      </Row>

      {/* ── FIRA CODE (datos, fechas, metadata) ──────────────────── */}
      <Divider title="Fira Code · datos, fechas y metadata" />

      <Row label="overline · 11 / Regular · MAYÚSCULAS + tracking">
        <Typography.Text variant="overline">Total facturado · jun 2026</Typography.Text>
      </Row>
      <Row label="caption · 13 / Regular (fechas, SKU, metadata)">
        <Typography.Text className="text-text-secondary" variant="caption">
          22 jun 2026 · 14:32 · SKU-00917
        </Typography.Text>
      </Row>
      <Row label="captionSmall · 10 / Regular (chips, badges)">
        <Typography.Text className="text-text-tertiary" variant="captionSmall">
          Ref: ORD-2026-04813 · hash: a3f9c2
        </Typography.Text>
      </Row>
      <Row label="data · 16 / Medium (montos, cifras, porcentajes)">
        <Typography.Text variant="data">Bs 4.280,50 · SKU-00917 · 85%</Typography.Text>
      </Row>
      <Row label="dataLarge · 28 / Medium (cifra hero, KPI)">
        <Typography.Text variant="dataLarge">Bs 12.940</Typography.Text>
      </Row>

      {/* ── EN CONTEXTO (las 3 fuentes trabajando juntas) ─────────── */}
      <Divider title="En contexto · Satoshi + Inter + Fira Code" />

      <View
        className="bg-bg-card"
        style={{
          borderRadius: 14,
          padding: 16,
          gap: 6,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        {/* header: Satoshi */}
        <Typography.Text className="text-text-secondary" variant="overline">
          Orden · 22 jun 2026
        </Typography.Text>
        <Typography.Text variant="h3">Resumen de facturación</Typography.Text>

        {/* body: Inter */}
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          Pedido confirmado · Envío estándar · Pago contra entrega
        </Typography.Text>

        <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)", marginVertical: 4 }} />

        {/* data: Fira Code */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Typography.Text className="text-text-secondary" variant="caption">
            Subtotal
          </Typography.Text>
          <Typography.Text variant="data">Bs 4.280,50</Typography.Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Typography.Text className="text-text-secondary" variant="caption">
            Descuento 15%
          </Typography.Text>
          <Typography.Text className="text-success" variant="data">
            -Bs 642,08
          </Typography.Text>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 4 }}
        >
          <Typography.Text variant="label">Total</Typography.Text>
          <Typography.Text variant="dataLarge">Bs 3.638,43</Typography.Text>
        </View>
        <Typography.Text className="text-text-tertiary" variant="captionSmall">
          ORD-2026-04813 · SKU-00917 · hace 2 min
        </Typography.Text>
      </View>
    </View>
  ),
};
