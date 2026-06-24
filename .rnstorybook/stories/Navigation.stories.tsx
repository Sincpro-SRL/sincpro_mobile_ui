import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Animated, View } from "react-native";

const meta: Meta = { title: "Components/Navigation" };
export default meta;

type Story = StoryObj;

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 4 }}>
      <Typography.Text className="text-text-tertiary px-1" variant="caption">
        {label}
      </Typography.Text>
      <View className="rounded-xl overflow-hidden border border-border-light">
        {children}
      </View>
    </View>
  );
}

function SearchHeaderDemo() {
  const [q, setQ] = useState("");
  return (
    <Navigation.AppBar
      actions={
        <Navigation.AppBar.Action badge={3} icon="notifications-outline" onPress={() => {}} />
      }
      safeArea={false}
      subheader={
        <Navigation.SearchBar onChangeText={setQ} placeholder="Buscar productos" value={q} />
      }
      title="Tienda"
    />
  );
}

// ─── AppBarDividers helpers ──────────────────────────────────────────────────

type DividerKind = "none" | "line" | "shadow" | "rounded" | "wave";

/**
 * Skeleton content rows below the AppBar.
 * bg MUST match the AppBar surface to show the same-color problem correctly:
 *   - default variant  → bg={theme.bg.card}  (blanco sobre blanco)
 *   - large variant    → bg={theme.bg.page}  (gris sobre gris)
 *   - gradient variant → bg={theme.bg.page}  (contraste intencional)
 */
function PageContent({ bg }: { bg: string }) {
  const dim = bg === theme.bg.card ? theme.border.light : theme.border.default;
  const dimmer = bg === theme.bg.card ? "#F3F4F6" : theme.border.light;
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: dim }} />
        <View style={{ gap: 4, flex: 1 }}>
          <View style={{ height: 10, width: "60%", backgroundColor: dim, borderRadius: 4 }} />
          <View
            style={{ height: 8, width: "40%", backgroundColor: dimmer, borderRadius: 4 }}
          />
        </View>
      </View>
      <View style={{ height: 8, width: "80%", backgroundColor: dimmer, borderRadius: 4 }} />
    </View>
  );
}

/** Demo frame — shadow skips overflow:hidden so the drop-shadow doesn't get clipped. */
function DemoFrame({ shadow, children }: { shadow?: boolean; children: React.ReactNode }) {
  return (
    <View
      className={
        shadow
          ? "rounded-xl border border-border-light"
          : "rounded-xl overflow-hidden border border-border-light"
      }
    >
      {children}
    </View>
  );
}

/** One sub-example: AppBar + content block below it. */
function DividerExample({
  label,
  divider,
  appBarProps,
  contentBg,
}: {
  label: string;
  divider?: DividerKind;
  appBarProps: React.ComponentProps<typeof Navigation.AppBar>;
  contentBg: string;
}) {
  return (
    <View style={{ gap: 3 }}>
      <Typography.Text className="text-text-tertiary px-1" variant="captionSmall">
        {label}
      </Typography.Text>
      <DemoFrame shadow={divider === "shadow"}>
        <Navigation.AppBar {...appBarProps} bottomDivider={divider} safeArea={false} />
        <PageContent bg={contentBg} />
      </DemoFrame>
    </View>
  );
}

const DIVIDER_CASES: { divider: DividerKind; description: string }[] = [
  { divider: "none", description: "sin separación — corte recto" },
  { divider: "line", description: "hairline border" },
  { divider: "shadow", description: "drop-shadow, sin border — efecto flotante" },
  { divider: "rounded", description: "esquinas redondeadas 24 px" },
  { divider: "wave", description: "arco inverso page-bg" },
];

export const AppBarDividers: Story = {
  render: () => (
    <View style={{ gap: 36 }}>
      {/* ─── BASELINE: sin bottomDivider — mismo color AppBar/contenido ─── */}
      <View style={{ gap: 10 }}>
        <View style={{ paddingHorizontal: 4, gap: 2 }}>
          <Typography.Text semibold variant="caption">
            Sin bottomDivider (comportamiento base)
          </Typography.Text>
          <Typography.Text className="text-text-tertiary" variant="captionSmall">
            AppBar y contenido del mismo color → el límite es invisible sin un separador
          </Typography.Text>
        </View>

        {/* default blanco → contenido blanco */}
        <DividerExample
          appBarProps={{
            title: "Detalle",
            subtitle: "Pedido #001",
            onBack: () => {},
            actions: (
              <Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />
            ),
          }}
          contentBg={theme.bg.card}
          label="default · back + acción · contenido BLANCO (bg-card = bg-card)"
        />

        {/* large gris → contenido gris */}
        <DividerExample
          appBarProps={{
            title: "Inicio",
            topSpacing: 8,
            variant: "large",
            actions: <Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />,
          }}
          contentBg={theme.bg.page}
          label="large · contenido GRIS (bg-page = bg-page)"
        />
      </View>

      {/* ─── VARIANTES ─── */}
      {DIVIDER_CASES.map(({ divider, description }) => (
        <View key={divider} style={{ gap: 10 }}>
          <View style={{ paddingHorizontal: 4, gap: 2 }}>
            <Typography.Text semibold variant="caption">
              {`bottomDivider="${divider}"`}
            </Typography.Text>
            <Typography.Text className="text-text-tertiary" variant="captionSmall">
              {description}
            </Typography.Text>
          </View>

          {/* default blanco → contenido blanco (caso crítico mismo color) */}
          <DividerExample
            appBarProps={{
              title: "Detalle",
              subtitle: "Pedido #001",
              onBack: () => {},
              actions: (
                <Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />
              ),
            }}
            contentBg={theme.bg.card}
            divider={divider}
            label="default · back + acción · contenido BLANCO (mismo color)"
          />

          {/* large gris → contenido gris (mismo color) */}
          <DividerExample
            appBarProps={{
              title: "Inicio",
              topSpacing: 8,
              variant: "large",
              actions: (
                <Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />
              ),
            }}
            contentBg={theme.bg.page}
            divider={divider}
            label="large · sin back · contenido GRIS (mismo color)"
          />

          {/* large gris → contenido gris, con back */}
          <DividerExample
            appBarProps={{
              title: "Pedidos",
              subtitle: "Nueva orden",
              topSpacing: 8,
              variant: "large",
              onBack: () => {},
              actions: <Navigation.AppBar.Action icon="add" onPress={() => {}} />,
            }}
            contentBg={theme.bg.page}
            divider={divider}
            label="large · con back + acción · contenido GRIS (mismo color)"
          />

          {/* large gradiente → contenido gris (colores distintos — referencia) */}
          <DividerExample
            appBarProps={{
              title: "Mi tren",
              subtitle: "Resumen de la jornada",
              topSpacing: 12,
              variant: "large",
              background: { surface: "night-green", pattern: "dots", patternOpacity: 0.13 },
              actions: (
                <Navigation.AppBar.Action icon="notifications-outline" onPress={() => {}} />
              ),
            }}
            contentBg={theme.bg.page}
            divider={divider}
            label="large · gradiente night-green → contenido gris (colores distintos)"
          />
        </View>
      ))}
    </View>
  ),
};

export const AppBarBackground: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Frame label='background preset "mesh" + dots texture'>
        <Navigation.AppBar
          background={{ surface: "mesh", pattern: "dots" }}
          safeArea={false}
          subtitle="Resumen de la jornada"
          title="Inicio"
          topSpacing={16}
          variant="large"
        />
      </Frame>
      <Frame label='background preset "night-green"'>
        <Navigation.AppBar
          background={{ surface: "night-green" }}
          safeArea={false}
          subtitle="Bs 4.280 · hoy"
          title="Dashboard"
          topSpacing={16}
          variant="large"
        />
      </Frame>
      <Frame label='background preset "neon-teal" + grid'>
        <Navigation.AppBar
          background={{ surface: "neon-teal", pattern: "grid", patternOpacity: 0.14 }}
          safeArea={false}
          title="Ventas"
          topSpacing={16}
          variant="large"
        />
      </Frame>
      <Frame label="background custom colors + diagonals">
        <Navigation.AppBar
          background={{
            colors: ["#0D1B3E", "#0B3A2A", "#1A0D3E"],
            end: { x: 1, y: 1 },
            start: { x: 0, y: 0 },
            pattern: "diagonals",
            patternOpacity: 0.2,
          }}
          safeArea={false}
          subtitle="Gestión de productos"
          title="Inventario"
          topSpacing={16}
          variant="large"
        />
      </Frame>
      <Frame label="background on compact default bar (back + actions)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />}
          background={{ surface: "night-green" }}
          onBack={() => {}}
          safeArea={false}
          subtitle="Pedido #001"
          title="Detalle"
        />
      </Frame>
      <Frame label='bottomDivider="rounded" — 24 px radius, gradient clipped'>
        <Navigation.AppBar
          background={{ surface: "night-green", pattern: "dots", patternOpacity: 0.15 }}
          bottomDivider="rounded"
          safeArea={false}
          title="Mi tren"
          topSpacing={16}
          variant="large"
        />
      </Frame>
      <Frame label='bottomDivider="wave" — inverse-arc page-bg cutout'>
        <Navigation.AppBar
          background={{ surface: "mesh", pattern: "grid", patternOpacity: 0.12 }}
          bottomDivider="wave"
          safeArea={false}
          subtitle="Resumen de la jornada"
          title="Inicio"
          topSpacing={16}
          variant="large"
        />
      </Frame>
    </View>
  ),
};

export const AppBar: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Frame label="default · back + acciones contenidas">
        <Navigation.AppBar
          actions={
            <>
              <Navigation.AppBar.Action icon="search" onPress={() => {}} />
              <Navigation.AppBar.Action
                badge={3}
                icon="notifications-outline"
                onPress={() => {}}
              />
            </>
          }
          onBack={() => {}}
          safeArea={false}
          subtitle="Detalle del pedido"
          title="Pedido #001"
        />
      </Frame>
      <Frame label="large-title + acción tinted">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          safeArea={false}
          title="Inicio"
          variant="large"
        />
      </Frame>
      <Frame label="center · back + acción (squircle con borde, estilo detalle)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />}
          onBack={() => {}}
          safeArea={false}
          title="Detalle"
          variant="center"
        />
      </Frame>
      <Frame label="search header (subheader = SearchBar pill)">
        <SearchHeaderDemo />
      </Frame>
      <Frame label="dark / hero (tone='dark')">
        <Navigation.AppBar
          actions={
            <Navigation.AppBar.Action
              icon="notifications-outline"
              onDark
              onPress={() => {}}
            />
          }
          safeArea={false}
          subtitle="Caja de hoy"
          title="Bs 4.280"
          tone="dark"
          variant="large"
        />
      </Frame>
      <Frame label="gradiente CTA · saludo (tone='gradient')">
        <Navigation.AppBar
          actions={
            <Navigation.AppBar.Action icon="notifications-outline" onPress={() => {}} />
          }
          safeArea={false}
          subtitle="Tenés 3 pedidos pendientes hoy"
          title="Buenos días, Mariana"
          tone="gradient"
          variant="large"
        />
      </Frame>
      <Frame label="large + barra de acento (accentBar)">
        <Navigation.AppBar
          accentBar
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          safeArea={false}
          subtitle="Resumen de la jornada"
          title="Reportes"
          variant="large"
        />
      </Frame>
    </View>
  ),
};

export const SearchBar: Story = {
  render: () => {
    return <SearchBarStory />;
  },
};

function SearchBarStory() {
  const [q, setQ] = useState("");
  return (
    <View style={{ gap: 12 }}>
      <Navigation.SearchBar onChangeText={setQ} placeholder="Buscar" value={q} />
      <Navigation.SearchBar
        editable={false}
        onChangeText={() => {}}
        onPress={() => {}}
        placeholder="Tocar para buscar"
        value=""
      />
    </View>
  );
}

function CollapsingDemo() {
  const [scrollY] = useState(() => new Animated.Value(0));
  return (
    <View style={{ height: 360 }}>
      <Navigation.CollapsingHeader
        actions={<Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />}
        onBack={() => {}}
        scrollY={scrollY}
        subtitle="Desplazá para colapsar"
        title="Inicio"
      />
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View className="px-4 py-3 border-b border-border-light" key={i}>
            <Typography.Text>Fila {i + 1}</Typography.Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export const CollapsingHeader: Story = { render: () => <CollapsingDemo /> };

const NAV_ITEMS = [
  { activeIcon: "home", icon: "home-outline", key: "home", label: "Inicio" },
  { icon: "cart-outline", key: "sales", label: "Ventas" },
  { icon: "cube-outline", key: "stock", label: "Stock" },
  { icon: "people-outline", key: "clients", label: "Clientes" },
  { icon: "settings-outline", key: "settings", label: "Ajustes" },
];

// One component (Navigation.BottomNav), every shape/variant by props — the single source of truth.
function BottomNavMatrixDemo() {
  const [tab, setTab] = useState("home");
  // activeColor="accent" → el activo usa el verde de marca (accent), no el primary (negro).
  const common = {
    activeColor: "accent" as const,
    items: NAV_ITEMS,
    onChange: setTab,
    value: tab,
  };
  return (
    <View style={{ gap: 18, paddingBottom: 24, backgroundColor: "#0001" }}>
      <Typography.Text variant="captionSmall">
        A · pastilla extendida con texto
      </Typography.Text>
      <Navigation.BottomNav
        {...common}
        indicator="pill-text"
        shape="floating"
        showLabels={false}
      />

      <Typography.Text variant="captionSmall">
        B · botón central elevado (FAB) — squircle con glow verde
      </Typography.Text>
      <Navigation.BottomNav
        {...common}
        centerAction={{ icon: "add", onPress: () => {} }}
        items={NAV_ITEMS.slice(0, 4)}
        shape="floating"
        showLabels={false}
      />

      <Typography.Text variant="captionSmall">C · oscura con indicador glow</Typography.Text>
      <Navigation.BottomNav
        {...common}
        indicator="glow"
        shape="floating"
        showLabels={false}
        tone="dark"
      />

      <Typography.Text variant="captionSmall">
        D · indicador de barra (top bar)
      </Typography.Text>
      <Navigation.BottomNav {...common} indicator="bar" />

      <Typography.Text variant="captionSmall">+ floating · pill icon-only</Typography.Text>
      <Navigation.BottomNav
        {...common}
        indicator="pill"
        shape="floating"
        showLabels={false}
      />
    </View>
  );
}

export const BottomNavVariants: Story = { render: () => <BottomNavMatrixDemo /> };

// ─── TicketsTabBar ────────────────────────────────────────────────────────────
// Configuración usada en sincpro_mobile_tickets (AppRoutes.tsx).
// indicator="pill-text": el tab activo muestra pill extendida con ícono + nombre.
// Los inactivos muestran solo ícono.
function TicketsTabBarDemo() {
  const [tab, setTab] = useState("home");
  const items = [
    { customIcon: HomeIcon, key: "odoo", label: "Odoo" },
    { customIcon: HomeIcon, key: "home", label: "Principal" },
    { customIcon: SettingsIcon, key: "settings", label: "Ajustes" },
    { customIcon: ProfileIcon, key: "profile", label: "Perfil" },
  ];
  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 8 }}>
        <Typography.Text semibold variant="caption">
          PRODUCCIÓN — pill-text (activo = ícono + nombre)
        </Typography.Text>
        <Typography.Text className="text-text-tertiary" variant="captionSmall">
          {'indicator="pill-text" · floating · activeColor="accent"'}
        </Typography.Text>
        <Navigation.BottomNav
          activeColor="accent"
          indicator="pill-text"
          items={items}
          onChange={setTab}
          shape="floating"
          showLabels={false}
          value={tab}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Typography.Text semibold variant="caption">
          Alternativa — pill + labels siempre visibles
        </Typography.Text>
        <Typography.Text className="text-text-tertiary" variant="captionSmall">
          {'indicator="pill" · showLabels · floating · activeColor="accent"'}
        </Typography.Text>
        <Navigation.BottomNav
          activeColor="accent"
          indicator="pill"
          items={items}
          onChange={setTab}
          shape="floating"
          showLabels
          value={tab}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Typography.Text semibold variant="caption">
          Alternativa — barra + labels (estilo iOS clásico)
        </Typography.Text>
        <Typography.Text className="text-text-tertiary" variant="captionSmall">
          {'indicator="bar" · showLabels · floating · activeColor="accent"'}
        </Typography.Text>
        <Navigation.BottomNav
          activeColor="accent"
          indicator="bar"
          items={items}
          onChange={setTab}
          shape="floating"
          showLabels
          value={tab}
        />
      </View>
    </View>
  );
}

export const TicketsTabBar: Story = { render: () => <TicketsTabBarDemo /> };
