import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import { type ChartPoint, Charts } from "@sincpro/mobile-ui/Charts";
import Card from "@sincpro/mobile-ui/Display/Display.Card";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { formatTwoDecimals } from "@sincpro/mobile-ui/utils/monetary";
import type { Meta, StoryObj } from "@storybook/react-native";
import { type ReactNode, useState } from "react";
import { View } from "react-native";

const meta = {
  title: "Components/Data Display/Charts",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const bolivianos = (value: number) => `Bs ${formatTwoDecimals(value)}`;

const MONTHS = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"];

const byMonth = (values: readonly (number | null)[]): ChartPoint[] =>
  MONTHS.map((key, index) => ({ key, value: values[index] ?? null }));

const DAILY: ChartPoint[] = Array.from({ length: 30 }, (_, index) => ({
  key: `${index + 1} nov`,
  value: index === 11 ? null : Math.round(3200 + 1400 * Math.sin(index / 3) + index * 60),
}));

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <View style={{ gap: 12 }}>
        <Typography.Heading variant="h3">{title}</Typography.Heading>
        {children}
      </View>
    </Card>
  );
}

export const SalesByMonth: Story = {
  render: () => (
    <ChartCard title="Ventas por mes">
      <Charts.Bar
        formatValue={bolivianos}
        label="Ventas por mes"
        series={[
          { name: "Ventas", data: byMonth([38200, 41500, 36900, 44800, 47100, 48200]) },
        ]}
      />
    </ChartCard>
  ),
};

export const SalesAgainstTarget: Story = {
  render: () => (
    <ChartCard title="Ventas contra meta">
      <Charts.Bar
        formatValue={bolivianos}
        label="Ventas contra meta"
        series={[
          { name: "Ventas", data: byMonth([38200, 41500, 36900, 44800, 47100, 48200]) },
          { name: "Meta", data: byMonth([40000, 40000, 42000, 42000, 45000, 45000]) },
        ]}
      />
    </ChartCard>
  ),
};

export const SalesByCategoryStacked: Story = {
  render: () => (
    <ChartCard title="Ventas por categoría">
      <Charts.Bar
        formatValue={bolivianos}
        label="Ventas por categoría"
        series={[
          { name: "Bebidas", data: byMonth([18000, 19500, 17000, 21000, 22500, 23800]) },
          { name: "Snacks", data: byMonth([12000, 13500, 12400, 14200, 15100, 14900]) },
          { name: "Limpieza", data: byMonth([8200, 8500, 7500, 9600, 9500, 9500]) },
        ]}
        stacked
      />
    </ChartCard>
  ),
};

export const MarginWithLosses: Story = {
  render: () => (
    <ChartCard title="Margen por producto">
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Los valores negativos crecen hacia abajo desde la misma línea base.
      </Typography.Text>
      <Charts.Bar
        formatValue={bolivianos}
        label="Margen por producto"
        series={[
          {
            name: "Margen",
            data: [
              { key: "Agua 2L", value: 1840 },
              { key: "Galletas", value: 920 },
              { key: "Detergente", value: -410 },
              { key: "Jugo 1L", value: 1260 },
              { key: "Yogur", value: -180 },
            ],
          },
        ]}
      />
    </ChartCard>
  ),
};

export const DailyCollections: Story = {
  render: () => (
    <ChartCard title="Cobros diarios">
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Tocá o arrastrá en horizontal para leer cada día. El 12 no tiene registro: la línea se
        corta en vez de inventar un valor.
      </Typography.Text>
      <Charts.Line
        area
        formatValue={bolivianos}
        label="Cobros diarios"
        series={[{ name: "Cobros", data: DAILY }]}
      />
    </ChartCard>
  ),
};

export const MonthOverMonth: Story = {
  render: () => (
    <ChartCard title="Este semestre contra el anterior">
      <Charts.Line
        formatValue={bolivianos}
        label="Ventas, este semestre contra el anterior"
        series={[
          {
            name: "Este semestre",
            data: byMonth([38200, 41500, 36900, 44800, 47100, 48200]),
          },
          { name: "Anterior", data: byMonth([35100, 36800, 38900, 37200, 40100, 42600]) },
        ]}
      />
    </ChartCard>
  ),
};

export const SalesByChannel: Story = {
  render: () => (
    <ChartCard title="Ventas por canal">
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Ocho canales: los más chicos se agrupan en «Otros» para no pasar de seis colores.
      </Typography.Text>
      <Charts.Donut
        data={[
          { key: "Tienda", value: 21400 },
          { key: "Ruta norte", value: 12800 },
          { key: "Ruta sur", value: 7300 },
          { key: "WhatsApp", value: 3900 },
          { key: "Web", value: 1700 },
          { key: "Teléfono", value: 600 },
          { key: "Ferias", value: 350 },
          { key: "Otros canales", value: 150 },
        ]}
        formatValue={bolivianos}
        label="Ventas por canal"
      />
    </ChartCard>
  ),
};

function DrillDownExample() {
  const [month, setMonth] = useState<string | null>(null);
  return (
    <ChartCard title="Ventas por mes">
      <Charts.Bar
        formatValue={bolivianos}
        label="Ventas por mes"
        onSelect={setMonth}
        series={[
          { name: "Ventas", data: byMonth([38200, 41500, 36900, 44800, 47100, 48200]) },
        ]}
      />
      <Typography.Text
        accessibilityLiveRegion="polite"
        className="text-text-secondary"
        variant="bodySmall"
      >
        {month
          ? `La app abriría las ventas de ${month}.`
          : "Tocá un mes para ver su detalle."}
      </Typography.Text>
    </ChartCard>
  );
}

export const DrillDown: Story = { render: () => <DrillDownExample /> };

export const LargeAmounts: Story = {
  render: () => (
    <ChartCard title="Facturación anual">
      <Charts.Bar
        formatValue={bolivianos}
        label="Facturación anual"
        series={[
          {
            name: "Facturación",
            data: [
              { key: "2022", value: 1_840_000 },
              { key: "2023", value: 2_310_000 },
              { key: "2024", value: 2_975_500 },
              { key: "2025", value: 3_420_750 },
            ],
          },
        ]}
      />
    </ChartCard>
  ),
};

function RefreshExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(byMonth([38200, 41500, 36900, 44800, 47100, 48200]));
  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData((current) =>
        current.map((point) => ({
          ...point,
          value: (point.value ?? 0) * (0.9 + Math.random() * 0.2),
        })),
      );
      setLoading(false);
    }, 1200);
  };
  return (
    <ChartCard title="Actualizando">
      <Charts.Bar
        formatValue={bolivianos}
        label="Ventas por mes"
        loading={loading}
        series={[{ name: "Ventas", data }]}
      />
      <Button disabled={loading} onPress={refresh} title="Actualizar" variant="secondary" />
    </ChartCard>
  );
}

export const States: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <RefreshExample />
      <ChartCard title="Cargando por primera vez">
        <Charts.Line label="Cobros diarios" loading series={[]} />
      </ChartCard>
      <ChartCard title="Sin datos">
        <Charts.Donut
          data={[]}
          emptyLabel="Todavía no hay ventas este mes"
          label="Ventas por canal"
        />
      </ChartCard>
    </View>
  ),
};
