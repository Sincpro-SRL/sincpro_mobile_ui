import { Display, type MenuGridItem } from "@sincpro/mobile-ui/Display";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import PinIcon from "@sincpro/mobile-ui/icons/PinIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { Typography } from "@sincpro/mobile-ui/Typography";
import JsonPreview from "@sincpro/mobile-ui/widgets/JSONViewer";
import { PromoBanner, type PromoBannerItem } from "@sincpro/mobile-ui/widgets/PromoBanner";
import { PromoModal } from "@sincpro/mobile-ui/widgets/PromoModal";
import { type QuickActionItem, QuickActions } from "@sincpro/mobile-ui/widgets/QuickActions";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const meta: Meta = { title: "Patterns/Widgets" };
export default meta;

type Story = StoryObj;

// ─── Shared fixtures ─────────────────────────────────────────────────────────

const gridItems: MenuGridItem[] = [
  { id: "1", title: "Odoo", customIcon: HomeIcon },
  { id: "2", title: "Eventos", customIcon: BoxTimeIcon },
  { id: "3", title: "Impresora", customIcon: SettingsIcon },
  { id: "4", title: "Perfil", customIcon: ProfileIcon },
];

const quickItems: QuickActionItem[] = [
  { id: "1", label: "Odoo", customIcon: HomeIcon, badge: 3 },
  { id: "2", label: "Eventos", customIcon: BoxTimeIcon },
  { id: "3", label: "Fallos", customIcon: SettingsIcon, badge: "!" },
  { id: "4", label: "Ubicación", customIcon: PinIcon },
  { id: "5", label: "Perfil", customIcon: ProfileIcon },
];

const bannerItems: PromoBannerItem[] = [
  {
    id: "1",
    title: "Nueva ruta express",
    subtitle: "Estación Antigua → Terminal",
    badge: "Nuevo",
    gradient: ["#022B14", "#065E2B", "#0DAF57"],
    ctaLabel: "Ver rutas",
    icon: HomeIcon,
  },
  {
    id: "2",
    title: "Reporte de ventas",
    subtitle: "Disponible para descarga",
    badge: "Listo",
    gradient: ["#0A143B", "#1a2fa8"],
    ctaLabel: "Descargar",
    icon: BoxTimeIcon,
  },
  {
    id: "3",
    title: "Ajusta tu impresora",
    subtitle: "Conecta via Bluetooth",
    icon: SettingsIcon,
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

export const MenuCardWidget: Story = {
  name: "MenuCard",
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography.Text className="text-text-tertiary" variant="caption">
        size=&quot;md&quot; (2-col default)
      </Typography.Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Display.MenuCard customIcon={HomeIcon} onPress={() => {}} title="Principal" />
        <Display.MenuCard
          customIcon={SettingsIcon}
          onPress={() => {}}
          title="Configurar impresora"
        />
      </View>
      <Typography.Text className="text-text-tertiary" variant="caption">
        size=&quot;sm&quot; (3-col)
      </Typography.Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Display.MenuCard customIcon={HomeIcon} onPress={() => {}} size="sm" title="Inicio" />
        <Display.MenuCard
          customIcon={BoxTimeIcon}
          onPress={() => {}}
          size="sm"
          title="Eventos"
        />
        <Display.MenuCard
          customIcon={SettingsIcon}
          onPress={() => {}}
          size="sm"
          title="Ajustes"
        />
      </View>
    </View>
  ),
};

export const MenuGridWidget: Story = {
  name: "MenuGrid — md (2-col)",
  render: () => <Display.MenuGrid items={gridItems} />,
};

export const MenuGridSmall: Story = {
  name: "MenuGrid — sm (3-col)",
  render: () => <Display.MenuGrid items={gridItems} size="sm" />,
};

export const QuickActionsWidget: Story = {
  name: "QuickActions",
  render: () => (
    <View style={{ gap: 24 }}>
      <QuickActions items={quickItems} title="Acciones Rápidas" />
      <QuickActions items={quickItems.slice(0, 3)} />
    </View>
  ),
};

export const PromoBannerWidget: Story = {
  name: "PromoBanner",
  render: () => (
    <View style={{ gap: 24 }}>
      <PromoBanner items={bannerItems} title="Destacados" />
      <PromoBanner items={bannerItems.slice(0, 1)} />
    </View>
  ),
};

function PromoModalDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ alignItems: "center", gap: 16 }}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: "#065E2B",
          borderRadius: 12,
          paddingHorizontal: 24,
          paddingVertical: 12,
        }}
      >
        <Typography.Text semibold style={{ color: "#FFFFFF" }} variant="body">
          Abrir PromoModal
        </Typography.Text>
      </TouchableOpacity>
      <PromoModal
        badge="Novedad"
        body="Ahora podés filtrar rutas por color directamente desde el panel principal. Accedé a más opciones con un solo toque."
        ctaLabel="Explorar ahora"
        headerGradient={["#022B14", "#065E2B"]}
        icon={HomeIcon}
        onDismiss={() => setVisible(false)}
        onPressCta={() => setVisible(false)}
        title="Nueva función disponible"
        visible={visible}
      />
    </View>
  );
}

export const PromoModalWidget: Story = {
  name: "PromoModal",
  render: () => <PromoModalDemo />,
};

export const JsonViewer: Story = {
  name: "JSONViewer",
  render: () => (
    <JsonPreview
      selectedJson={JSON.stringify(
        { id: 1, name: "ticket", ok: true, tags: ["a", "b"] },
        null,
        2,
      )}
    />
  ),
};
