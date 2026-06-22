import { Display } from "@sincpro/mobile-ui/Display";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useRef, useState } from "react";
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
  const scrollY = useRef(new Animated.Value(0)).current;
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
        floating · pill activa · icon + label (estilo objetivo)
      </Typography.Text>
      <Navigation.BottomNav {...common} indicator="pill" shape="floating" />

      <Typography.Text variant="captionSmall">floating · icon-only · pill</Typography.Text>
      <Navigation.BottomNav
        {...common}
        indicator="pill"
        shape="floating"
        showLabels={false}
      />

      <Typography.Text variant="captionSmall">floating · center FAB</Typography.Text>
      <Navigation.BottomNav
        {...common}
        centerAction={{ icon: "add", onPress: () => {} }}
        items={NAV_ITEMS.slice(0, 4)}
        shape="floating"
      />

      <Typography.Text variant="captionSmall">bar (docked) · icon + label</Typography.Text>
      <Navigation.BottomNav {...common} indicator="pill" />

      <Typography.Text variant="captionSmall">bar · icon-only</Typography.Text>
      <Navigation.BottomNav {...common} showLabels={false} />
    </View>
  );
}

export const BottomNavVariants: Story = { render: () => <BottomNavMatrixDemo /> };

export const MenuButton: Story = {
  render: () => (
    <View style={{ width: 280, gap: 4 }}>
      <Display.MenuButton icon={HomeIcon} label="Configuración" onPress={() => {}} />
      <Display.MenuButton icon={HomeIcon} label="Mi cuenta" onPress={() => {}} />
    </View>
  ),
};

export const Menu: Story = {
  render: () => (
    <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 8 }}>
      <Navigation.Menu
        items={[
          { label: "Editar", icon: "create-outline", onPress: () => {} },
          { label: "Compartir", icon: "share-outline", onPress: () => {} },
          { label: "Duplicar", icon: "copy-outline", onPress: () => {} },
          { separator: true },
          { label: "Eliminar", icon: "trash-outline", destructive: true, onPress: () => {} },
        ]}
      />
    </View>
  ),
};
