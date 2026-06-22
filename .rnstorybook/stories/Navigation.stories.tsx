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
      <Frame label="search header (subheader = SearchBar pill)">
        <SearchHeaderDemo />
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

function FloatingBarDemo() {
  const [tab, setTab] = useState("home");
  return (
    <View style={{ height: 360, backgroundColor: "#0001" }}>
      <Navigation.FloatingBar position="bottom">
        <Navigation.BottomNav
          className="bg-transparent border-0"
          items={[
            { key: "home", icon: "home-outline", activeIcon: "home" },
            { key: "search", icon: "search-outline" },
            { key: "cart", icon: "cart-outline", badge: 2 },
            { key: "profile", icon: "person-outline" },
          ]}
          onChange={setTab}
          safeArea={false}
          showLabels={false}
          value={tab}
        />
      </Navigation.FloatingBar>
    </View>
  );
}

export const FloatingBar: Story = { render: () => <FloatingBarDemo /> };

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
