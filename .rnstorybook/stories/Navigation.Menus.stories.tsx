import { Display } from "@sincpro/mobile-ui/Display";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import PinIcon from "@sincpro/mobile-ui/icons/PinIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

const meta: Meta = { title: "Components/Navigation/Menus" };
export default meta;

type Story = StoryObj;

const alert = (msg: string) => Alert.alert(msg);

// ─── Navigation.MenuSection ──────────────────────────────────────────────────

export const MenuSectionStory: Story = {
  name: "MenuSection — grouped rows",
  render: () => (
    <View style={{ gap: 0 }}>
      <Navigation.MenuSection
        footer="Estos ajustes afectan a todos los conductores."
        title="General"
      >
        <Display.MenuButton
          icon={SettingsIcon}
          label="Configurar impresora"
          onPress={() => alert("Impresora")}
        />
        <Display.MenuButton
          icon={BoxTimeIcon}
          label="Reportes"
          onPress={() => alert("Reportes")}
          showDivider={false}
          value="Mensual"
        />
      </Navigation.MenuSection>

      <Navigation.MenuSection title="Cuenta">
        <Display.MenuButton
          icon={ProfileIcon}
          label="Mi perfil"
          onPress={() => alert("Perfil")}
        />
        <Display.MenuButton
          icon={PinIcon}
          label="Cerrar sesión"
          onPress={() => alert("Logout")}
          showDivider={false}
          variant="danger"
        />
      </Navigation.MenuSection>
    </View>
  ),
};

// ─── MenuButton — basic navigation ───────────────────────────────────────────

export const MenuButtonBasic: Story = {
  name: "MenuButton — navigation",
  render: () => (
    <Navigation.MenuSection title="Navegación básica">
      <Display.MenuButton
        icon={HomeIcon}
        label="Sin descripción"
        onPress={() => alert("Home")}
      />
      <Display.MenuButton
        description="Última sincronización: hace 2 min"
        icon={BoxTimeIcon}
        label="Con descripción"
        onPress={() => alert("Eventos")}
      />
      <Display.MenuButton
        icon={SettingsIcon}
        label="Con valor actual"
        onPress={() => alert("Ajustes")}
        value="Avanzado"
      />
      <Display.MenuButton
        description="Administra los permisos del sistema"
        icon={PinIcon}
        label="Valor + descripción"
        onPress={() => alert("Permisos")}
        showDivider={false}
        value="Siempre"
      />
    </Navigation.MenuSection>
  ),
};

// ─── MenuButton — toggles ─────────────────────────────────────────────────────

function ToggleDemo() {
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  const [sync, setSync] = useState(false);
  return (
    <Navigation.MenuSection
      footer="Los cambios se aplican de inmediato."
      title="Preferencias"
    >
      <Display.MenuButton
        icon={HomeIcon}
        label="Notificaciones"
        toggle={{ value: notif, onToggle: setNotif }}
      />
      <Display.MenuButton
        description="Cambia los colores del sistema"
        icon={SettingsIcon}
        label="Tema oscuro"
        toggle={{ value: dark, onToggle: setDark }}
      />
      <Display.MenuButton
        icon={BoxTimeIcon}
        label="Sincronización automática"
        showDivider={false}
        toggle={{ value: sync, onToggle: setSync }}
      />
    </Navigation.MenuSection>
  );
}

export const MenuButtonToggles: Story = {
  name: "MenuButton — toggles",
  render: () => <ToggleDemo />,
};

// ─── MenuButton — badges / status ────────────────────────────────────────────

export const MenuButtonBadges: Story = {
  name: "MenuButton — badges",
  render: () => (
    <Navigation.MenuSection title="Estado del sistema">
      <Display.MenuButton
        badge="active"
        icon={PinIcon}
        label='badge="active"'
        onPress={() => {}}
      />
      <Display.MenuButton
        badge="inactive"
        icon={SettingsIcon}
        label='badge="inactive"'
        onPress={() => {}}
      />
      <Display.MenuButton
        badge="new"
        icon={HomeIcon}
        label='badge="new"'
        onPress={() => {}}
      />
      <Display.MenuButton
        badge={5}
        icon={BoxTimeIcon}
        label="badge numérico (5)"
        onPress={() => {}}
      />
      <Display.MenuButton
        badge="Beta"
        icon={ProfileIcon}
        label="badge texto custom"
        onPress={() => {}}
        showDivider={false}
      />
    </Navigation.MenuSection>
  ),
};

// ─── MenuButton — swipe actions ──────────────────────────────────────────────

export const MenuButtonSwipe: Story = {
  name: "MenuButton — swipe actions",
  render: () => (
    <Navigation.MenuSection
      footer="Deslizá a la izquierda para ver opciones."
      title="Lista con acciones"
    >
      <Display.MenuButton
        description="Conductor · Ruta 4"
        icon={ProfileIcon}
        label="Guillermo Pérez"
        onPress={() => alert("Perfil")}
        swipeActions={[
          {
            label: "Editar",
            icon: "create-outline",
            color: "#2563EB",
            onPress: () => alert("Editar"),
          },
          {
            label: "Eliminar",
            icon: "trash-outline",
            color: "#DC2626",
            onPress: () => alert("Eliminar"),
          },
        ]}
      />
      <Display.MenuButton
        badge="active"
        description="Activo hoy"
        icon={BoxTimeIcon}
        label="Turno 07:00–15:00"
        swipeActions={[
          {
            label: "Cerrar turno",
            icon: "close-circle-outline",
            color: "#F59E0B",
            onPress: () => alert("Cerrar"),
          },
        ]}
        swipeLeftActions={[
          {
            label: "Extender",
            icon: "time-outline",
            color: "#16A34A",
            onPress: () => alert("Extender"),
          },
        ]}
      />
      <Display.MenuButton
        icon={SettingsIcon}
        label="Impresora Bluetooth"
        showDivider={false}
        swipeActions={[
          {
            label: "Desvincular",
            icon: "unlink-outline",
            color: "#6B7280",
            onPress: () => alert("Desvincular"),
          },
        ]}
      />
    </Navigation.MenuSection>
  ),
};

// ─── MenuButton — loading state ──────────────────────────────────────────────

export const MenuButtonLoading: Story = {
  name: "MenuButton — loading",
  render: () => (
    <Navigation.MenuSection title="Estado de carga">
      <Display.MenuButton icon={SettingsIcon} label="Sincronizando datos..." loading />
      <Display.MenuButton
        description="Verificando credenciales"
        icon={ProfileIcon}
        label="Cargando perfil"
        loading
        showDivider={false}
      />
    </Navigation.MenuSection>
  ),
};

// ─── MenuButton — variants ───────────────────────────────────────────────────

export const MenuButtonVariants: Story = {
  name: "MenuButton — variants",
  render: () => (
    <View style={{ gap: 0 }}>
      <Navigation.MenuSection title='variant="default"'>
        <Display.MenuButton icon={HomeIcon} label="Default con chevron" onPress={() => {}} />
        <Display.MenuButton
          icon={SettingsIcon}
          label="Default sin acción (estático)"
          showDivider={false}
        />
      </Navigation.MenuSection>

      <Navigation.MenuSection title='variant="success"'>
        <Display.MenuButton
          badge="active"
          icon={HomeIcon}
          label="Servicio activo"
          showDivider={false}
          variant="success"
        />
      </Navigation.MenuSection>

      <Navigation.MenuSection title='variant="danger"'>
        <Display.MenuButton
          icon={PinIcon}
          label="Cerrar sesión"
          onPress={() => alert("Logout")}
          variant="danger"
        />
        <Display.MenuButton
          icon={PinIcon}
          label="Eliminar cuenta"
          onPress={() => alert("Eliminar")}
          showDivider={false}
          variant="danger"
        />
      </Navigation.MenuSection>

      <Navigation.MenuSection title="disabled">
        <Display.MenuButton
          disabled
          icon={BoxTimeIcon}
          label="Acción deshabilitada"
          onPress={() => {}}
          showDivider={false}
        />
      </Navigation.MenuSection>
    </View>
  ),
};

// ─── Navigation.Menu — popover ───────────────────────────────────────────────

export const MenuDefault: Story = {
  name: "Menu — default trigger",
  render: () => (
    <View style={{ alignItems: "flex-end", padding: 16 }}>
      <Navigation.Menu
        items={[
          { label: "Editar", icon: "create-outline", onPress: () => alert("Editar") },
          { label: "Duplicar", icon: "copy-outline", onPress: () => alert("Duplicar") },
          { separator: true },
          {
            label: "Eliminar",
            icon: "trash-outline",
            destructive: true,
            onPress: () => alert("Eliminar"),
          },
        ]}
      />
      <Typography.Text className="text-text-tertiary mt-3" variant="caption">
        Tocá los 3 puntos para abrir.
      </Typography.Text>
    </View>
  ),
};

export const MenuCustomTrigger: Story = {
  name: "Menu — custom trigger",
  render: () => (
    <View style={{ padding: 16, gap: 24 }}>
      <View style={{ gap: 8 }}>
        <Typography.Text className="text-text-tertiary" variant="caption">
          Trigger: botón con texto
        </Typography.Text>
        <Navigation.Menu
          items={[
            { label: "Exportar CSV", icon: "download-outline", onPress: () => alert("CSV") },
            { label: "Exportar PDF", icon: "document-outline", onPress: () => alert("PDF") },
            { separator: true },
            { label: "Archivar", icon: "archive-outline", onPress: () => alert("Archivar") },
          ]}
          trigger={
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                alignSelf: "flex-start",
              }}
            >
              <Typography.Text variant="bodySmall">Acciones</Typography.Text>
              <Display.Icon name="chevron-down-outline" size={14} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={{ gap: 8 }}>
        <Typography.Text className="text-text-tertiary" variant="caption">
          Trigger: icono de settings
        </Typography.Text>
        <Navigation.Menu
          items={[
            {
              label: "Configuración",
              icon: "settings-outline",
              onPress: () => alert("Config"),
            },
            {
              label: "Notificaciones",
              icon: "notifications-outline",
              onPress: () => alert("Notif"),
            },
            { separator: true },
            {
              label: "Cerrar sesión",
              icon: "log-out-outline",
              destructive: true,
              onPress: () => alert("Logout"),
            },
          ]}
          trigger={
            <TouchableOpacity
              style={{ padding: 6, borderRadius: 8, backgroundColor: "#F3F4F6" }}
            >
              <Display.Icon name="settings-outline" size={20} />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  ),
};

export const MenuItemTypes: Story = {
  name: "Menu — tipos de items",
  render: () => (
    <View style={{ alignItems: "flex-start", padding: 16, gap: 24 }}>
      <View style={{ gap: 8 }}>
        <Typography.Text className="text-text-tertiary" variant="caption">
          Con iconos
        </Typography.Text>
        <Navigation.Menu
          items={[
            { label: "Editar", icon: "create-outline", onPress: () => alert("Editar") },
            { label: "Mover", icon: "arrow-forward-outline", onPress: () => alert("Mover") },
            { label: "Compartir", icon: "share-outline", onPress: () => alert("Compartir") },
            { separator: true },
            {
              label: "Eliminar",
              icon: "trash-outline",
              destructive: true,
              onPress: () => alert("Eliminar"),
            },
          ]}
          trigger={
            <TouchableOpacity
              style={{ padding: 4, borderRadius: 6, backgroundColor: "#F3F4F6" }}
            >
              <Display.Icon name="ellipsis-horizontal" size={20} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={{ gap: 8 }}>
        <Typography.Text className="text-text-tertiary" variant="caption">
          Sin iconos
        </Typography.Text>
        <Navigation.Menu
          items={[
            { label: "Ver detalle", onPress: () => alert("Detalle") },
            { label: "Duplicar", onPress: () => alert("Duplicar") },
            { separator: true },
            { label: "Eliminar", destructive: true, onPress: () => alert("Eliminar") },
          ]}
          trigger={
            <TouchableOpacity
              style={{ padding: 4, borderRadius: 6, backgroundColor: "#F3F4F6" }}
            >
              <Display.Icon name="ellipsis-horizontal" size={20} />
            </TouchableOpacity>
          }
        />
      </View>

      <View style={{ gap: 8 }}>
        <Typography.Text className="text-text-tertiary" variant="caption">
          Con items deshabilitados
        </Typography.Text>
        <Navigation.Menu
          items={[
            {
              label: "Publicar",
              icon: "cloud-upload-outline",
              onPress: () => alert("Publicar"),
            },
            {
              label: "Aprobar (sin permiso)",
              icon: "checkmark-circle-outline",
              disabled: true,
              onPress: () => {},
            },
            { separator: true },
            {
              label: "Rechazar",
              icon: "close-circle-outline",
              destructive: true,
              onPress: () => alert("Rechazar"),
            },
          ]}
          trigger={
            <TouchableOpacity
              style={{ padding: 4, borderRadius: 6, backgroundColor: "#F3F4F6" }}
            >
              <Display.Icon name="ellipsis-horizontal" size={20} />
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  ),
};
