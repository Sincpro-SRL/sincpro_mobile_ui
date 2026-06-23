/**
 * Views/Form — FormViewV2: contenedor de un registro (detalle / crear / editar / settings).
 *
 * Cada story muestra UNA capacidad de la API. Las piezas de contenido puro
 * (Group/Section/estados) viven en `Views/Form/Content`.
 *
 * Layout: height:680 + alignSelf:"stretch" — contenedor acotado para que el
 * KeyboardAwareScrollView interno haga scroll.
 *
 * Regla ActionsBar (Guardar/Cancelar):
 *   CORRECTO:   <FormViewV2.Header variant="default" />
 *               <FormViewV2.Header.ActionsBar>…</FormViewV2.Header.ActionsBar>
 *   INCORRECTO: <FormViewV2.Header>…ActionsBar…</FormViewV2.Header>  ← va al subheader
 */
import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import FormViewV2 from "@sincpro/mobile-ui/views/FormViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Switch, View } from "react-native";

import {
  CATEGORIES,
  Divider,
  DocActionsBar,
  KeyValueRow,
  LeadingIcon,
  SectionLabel,
  VariantFrame,
} from "./views.helpers";

const meta: Meta = { title: "Views/Form" };
export default meta;
type Story = StoryObj;

/**
 * API: variant="large" · Content.Groups + Group · inputs de texto/select/qty · Footer sticky
 */
function FormViewLargeHeaderStory() {
  const [name, setName] = useState("Café molido premium");
  const [category, setCategory] = useState<string | null>("food");
  const [price, setPrice] = useState("45.00");
  const [qty, setQty] = useState(10);

  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        item={{ name }}
        name="Producto"
        onBack={() => {}}
        withContainer={false}
      >
        {/* variant="large": bg-bg-page (transparente), título grande, sin borde */}
        <FormViewV2.Header
          actions={<Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />}
          variant="large"
        />

        {/* Content: scrollable (KeyboardAwareScrollView interno) */}
        <FormViewV2.Content>
          <FormViewV2.Content.Groups>
            {/* Group: card con borde, shadow md, mx-4 */}
            <FormViewV2.Content.Group>
              <Form.Input
                label="Nombre del producto"
                onChangeText={setName}
                placeholder="Ej. Café molido"
                value={name}
              />
              <Form.Select
                label="Categoría"
                onChange={(v) => setCategory(String(v))}
                options={CATEGORIES}
                placeholder="Seleccionar categoría"
                value={category}
              />
              <Form.Input
                keyboardType="numeric"
                label="Precio (Bs)"
                onChangeText={setPrice}
                value={price}
              />
            </FormViewV2.Content.Group>

            {/* El padding del Group (md) ya da el espaciado — sin Views extra */}
            <FormViewV2.Content.Group title="Stock inicial">
              <Form.QuantitySelector min={0} onChange={setQty} value={qty} />
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>

        {/* Footer: sticky (renderiza fuera del scroll, dentro del Root flex) */}
        <FormViewV2.Footer>
          <Form.Button onPress={() => {}} title="Guardar producto" />
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  );
}

export const LargeHeader: Story = { render: () => <FormViewLargeHeaderStory /> };

/**
 * API: variant="default" + back · ActionsBar SIBLING (Cancelar/Guardar) · DatePicker · Footer aux
 *
 * Patrón EditForm: los botones Cancelar/Guardar van en ActionsBar (no en Footer
 * ni como children del Header). Footer queda para acciones auxiliares.
 */
function FormViewEditWithActionsBarStory() {
  const [alias, setAlias] = useState("Impresora principal");
  const [ip, setIp] = useState("192.168.1.100");
  const [port, setPort] = useState("9100");
  const [date, setDate] = useState(new Date());
  const [autoConnect, setAutoConnect] = useState(true);

  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        description="Datos de configuración"
        item={{ alias }}
        name="Impresora"
        onBack={() => {}}
        withContainer={false}
      >
        {/* variant="default": AppBar compacto, bg-bg-card, borde inferior */}
        <FormViewV2.Header variant="default" />

        {/* ActionsBar: SIBLING — barra debajo del AppBar (NO en subheader) */}
        <FormViewV2.Header.ActionsBar>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Cancelar" variant="outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Guardar" />
          </View>
        </FormViewV2.Header.ActionsBar>

        <FormViewV2.Content>
          <FormViewV2.Content.Groups>
            <FormViewV2.Content.Group>
              <Form.Input label="Alias" onChangeText={setAlias} value={alias} />
              <Form.Input
                keyboardType="numeric"
                label="Dirección IP"
                onChangeText={setIp}
                value={ip}
              />
              <Form.Input
                keyboardType="numeric"
                label="Puerto"
                onChangeText={setPort}
                value={port}
              />
              <Form.DatePicker
                label="Fecha de instalación"
                onChange={(d: Date) => setDate(d)}
                value={date}
              />
            </FormViewV2.Content.Group>

            <FormViewV2.Content.Group>
              <Display.ListItem
                leading={<LeadingIcon name="wifi-outline" />}
                subtitle="Conectar al iniciar la app"
                title="Conexión automática"
                trailing={
                  <Switch
                    onValueChange={setAutoConnect}
                    trackColor={{ false: theme.bg.muted, true: theme.accent }}
                    value={autoConnect}
                  />
                }
              />
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>

        {/* Footer: acción auxiliar. Cancelar/Guardar están en ActionsBar. */}
        <FormViewV2.Footer>
          <Form.Button onPress={() => {}} title="Probar conexión" variant="outline" />
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  );
}

export const EditWithActionsBar: Story = {
  render: () => <FormViewEditWithActionsBarStory />,
};

/**
 * API: variant="center" · withMargin · display read-only · variant="data" (Fira Code) para IDs
 *
 * Patrón ReadOnly: AppBar centrado (estilo modal/detalle), sin inputs,
 * tipografía mono (data) para SKUs, códigos y fechas.
 */
function FormViewReadOnlyStory() {
  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        item={{ id: "PRD-0042" }}
        name="Producto"
        onBack={() => {}}
        withContainer={false}
      >
        <FormViewV2.Header
          actions={<Navigation.AppBar.Action icon="create-outline" onPress={() => {}} />}
          variant="center"
        />

        {/* withMargin: paddingHorizontal:16 automático sobre el contenido */}
        <FormViewV2.Content withMargin>
          <View
            style={{
              height: 140,
              marginVertical: 16,
              borderRadius: 16,
              backgroundColor: theme.bg.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Display.Icon
              color={theme.icon.tertiary}
              name="image-outline"
              size={36}
              type="ionicons"
            />
          </View>

          <Typography.Text semibold style={{ marginBottom: 2 }} variant="h3">
            Café molido premium
          </Typography.Text>
          <Typography.Text
            style={{ color: theme.text.secondary, marginBottom: 16 }}
            variant="bodySmall"
          >
            Alimentos
          </Typography.Text>

          {/* variant="data" (Fira Code Medium) para IDs, códigos y fechas */}
          <Display.Card padding="none">
            <KeyValueRow label="SKU" mono value="SKU-042" />
            <Divider />
            <KeyValueRow label="Código de barras" mono value="7891000315507" />
            <Divider />
            <KeyValueRow label="Fecha de registro" mono value="2026-01-15" />
            <Divider />
            <KeyValueRow label="Última actualización" mono value="2026-06-20 14:32" />
          </Display.Card>

          <View style={{ height: 12 }} />

          <Display.Card padding="none">
            <KeyValueRow label="Precio de venta" mono value="Bs 45.00" />
            <Divider />
            <KeyValueRow label="Precio de costo" mono value="Bs 28.00" />
            <Divider />
            <KeyValueRow label="Stock actual" value="48 unidades" />
          </Display.Card>
        </FormViewV2.Content>

        <FormViewV2.Footer>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Form.Button onPress={() => {}} title="Editar" variant="outline" />
            </View>
            <View style={{ flex: 1 }}>
              <Form.Button onPress={() => {}} title="Ver historial" />
            </View>
          </View>
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  );
}

export const ReadOnly: Story = { render: () => <FormViewReadOnlyStory /> };

/**
 * API: variant="large" · Content.Section · Display.ListItem + Switch trailing
 *
 * Patrón Settings: Content.Section = SectionHeader + Card(padding=none).
 * Rows son Display.ListItem (no inputs de formulario).
 */
function FormViewSettingsStory() {
  const [autoSync, setAutoSync] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        item={{ settings: true }}
        name="Ajustes"
        onBack={() => {}}
        withContainer={false}
      >
        <FormViewV2.Header variant="large" />

        <FormViewV2.Content>
          {/* Hero de cuenta: ListItem con Avatar (mismo patrón que un menú de ajustes) */}
          <FormViewV2.Content.Section>
            <Display.ListItem
              chevron
              leading={<Display.Avatar initials="MR" size={44} />}
              onPress={() => {}}
              showDivider={false}
              subtitle="Administrador · SINCPRO"
              title="Mariana Rojas"
            />
          </FormViewV2.Content.Section>

          <FormViewV2.Content.Section title="Sincronización">
            <Display.ListItem
              leading={<LeadingIcon name="sync-outline" />}
              subtitle="Sincronizar datos al abrir la app"
              title="Sincronización automática"
              trailing={
                <Switch
                  onValueChange={setAutoSync}
                  trackColor={{ false: theme.bg.muted, true: theme.accent }}
                  value={autoSync}
                />
              }
            />
            <Divider />
            <Display.ListItem
              leading={
                <LeadingIcon color={wifi ? theme.accent : undefined} name="wifi-outline" />
              }
              subtitle="Solo sincronizar con Wi-Fi"
              title="Solo por Wi-Fi"
              trailing={
                <Switch
                  onValueChange={setWifi}
                  trackColor={{ false: theme.bg.muted, true: theme.accent }}
                  value={wifi}
                />
              }
            />
          </FormViewV2.Content.Section>

          <FormViewV2.Content.Section title="Apariencia">
            <Display.ListItem
              leading={<LeadingIcon name="moon-outline" />}
              title="Modo oscuro"
              trailing={
                <Switch
                  onValueChange={setDarkMode}
                  trackColor={{ false: theme.bg.muted, true: theme.accent }}
                  value={darkMode}
                />
              }
            />
          </FormViewV2.Content.Section>

          <FormViewV2.Content.Section title="Notificaciones">
            <Display.ListItem
              leading={<LeadingIcon name="notifications-outline" />}
              subtitle="Alertas de inventario bajo"
              title="Notificaciones de stock"
              trailing={
                <Switch
                  onValueChange={setNotifications}
                  trackColor={{ false: theme.bg.muted, true: theme.accent }}
                  value={notifications}
                />
              }
            />
            <Divider />
            <Display.ListItem
              leading={<LeadingIcon name="information-circle-outline" />}
              onPress={() => {}}
              title="Acerca de la app"
              trailing={
                <Navigation.AppBar.Action bare icon="chevron-forward" onPress={() => {}} />
              }
            />
          </FormViewV2.Content.Section>

          <FormViewV2.Content.Section title="Cuenta">
            <Display.ListItem
              leading={<LeadingIcon name="person-outline" />}
              onPress={() => {}}
              title="Mi perfil"
              trailing={
                <Navigation.AppBar.Action bare icon="chevron-forward" onPress={() => {}} />
              }
            />
            <Divider />
            <Display.ListItem
              leading={<LeadingIcon name="log-out-outline" />}
              onPress={() => {}}
              title="Cerrar sesión"
              trailing={
                <Navigation.AppBar.Action bare icon="chevron-forward" onPress={() => {}} />
              }
            />
          </FormViewV2.Content.Section>
        </FormViewV2.Content>
      </FormViewV2.Root>
    </View>
  );
}

export const Settings: Story = { render: () => <FormViewSettingsStory /> };

/**
 * API: tone="dark" · variant="large" · onDark action — héroe oscuro para reportes.
 * El AppBar tiene superficie siempre-oscura; el contenido debajo es bg-bg-page normal.
 */
function FormViewDarkHeroStory() {
  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        description="Resumen del día"
        item={{ sales: true }}
        name="Ventas"
        onBack={() => {}}
        withContainer={false}
      >
        <FormViewV2.Header
          actions={
            <Navigation.AppBar.Action icon="download-outline" onDark onPress={() => {}} />
          }
          tone="dark"
          variant="large"
        />

        <FormViewV2.Content>
          {/* Stat cards debajo del AppBar oscuro */}
          <View style={{ flexDirection: "row", gap: 8, padding: 16 }}>
            {[
              { label: "Total ventas", value: "Bs 4.280" },
              { label: "Pedidos", value: "38" },
            ].map((s) => (
              <View
                key={s.label}
                style={[
                  {
                    flex: 1,
                    backgroundColor: theme.bg.card,
                    borderRadius: 12,
                    padding: 12,
                  },
                  theme.shadow.sm,
                ]}
              >
                <Typography.Text
                  style={{ color: theme.text.secondary }}
                  variant="captionSmall"
                >
                  {s.label}
                </Typography.Text>
                <Typography.Text semibold variant="h3">
                  {s.value}
                </Typography.Text>
              </View>
            ))}
          </View>

          <FormViewV2.Content.Groups>
            {/* Content.Group title: SectionHeader encima del card */}
            <FormViewV2.Content.Group title="Últimas transacciones">
              {["Pedido #001 · Bs 320", "Pedido #002 · Bs 180", "Pedido #003 · Bs 540"].map(
                (t, i, arr) => (
                  <View
                    key={t}
                    style={{
                      borderBottomColor: theme.border.light,
                      borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Typography.Text variant="body">{t}</Typography.Text>
                  </View>
                ),
              )}
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>

        <FormViewV2.Footer>
          <Form.Button onPress={() => {}} title="Ver reporte completo" />
        </FormViewV2.Footer>
      </FormViewV2.Root>
    </View>
  );
}

export const DarkHero: Story = { render: () => <FormViewDarkHeroStory /> };

/**
 * API: tone="gradient" · variant="large" · sin back — cabecera saludo (dashboard/home)
 */
function FormViewGradientHeroStory() {
  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root
        description="Tenés 3 pedidos pendientes"
        item={{ user: true }}
        name="Buenos días, Mariana"
        withContainer={false}
      >
        <FormViewV2.Header
          actions={
            <Navigation.AppBar.Action icon="notifications-outline" onPress={() => {}} />
          }
          tone="gradient"
          variant="large"
        />

        <FormViewV2.Content>
          <FormViewV2.Content.Groups>
            <FormViewV2.Content.Group title="Acciones rápidas">
              <View style={{ flexDirection: "row", gap: 8, padding: 8 }}>
                {[
                  { icon: "cart-outline", label: "Nueva venta" },
                  { icon: "cube-outline", label: "Inventario" },
                  { icon: "people-outline", label: "Clientes" },
                ].map((a) => (
                  <View
                    key={a.label}
                    style={{ alignItems: "center", flex: 1, gap: 4, paddingVertical: 12 }}
                  >
                    <LeadingIcon name={a.icon} />
                    <Typography.Text variant="captionSmall">{a.label}</Typography.Text>
                  </View>
                ))}
              </View>
            </FormViewV2.Content.Group>
          </FormViewV2.Content.Groups>
        </FormViewV2.Content>
      </FormViewV2.Root>
    </View>
  );
}

export const GradientHero: Story = { render: () => <FormViewGradientHeroStory /> };

/**
 * API: FormViewV2.Header.Segmented — switch tipo tabs en el subheader del AppBar.
 * El contenido del Content cambia según el segmento (Detalles / Historial).
 */
function FormViewWithSegmentedStory() {
  const [tab, setTab] = useState<"detalle" | "historial">("detalle");
  return (
    <View style={{ height: 680, alignSelf: "stretch" }}>
      <FormViewV2.Root item={{}} name="Producto #001" onBack={() => {}} withContainer={false}>
        <FormViewV2.Header variant="default">
          <FormViewV2.Header.Segmented
            onChange={setTab}
            options={[
              { label: "Detalles", value: "detalle" },
              { label: "Historial", value: "historial" },
            ]}
            value={tab}
          />
        </FormViewV2.Header>

        <FormViewV2.Content>
          {tab === "detalle" ? (
            <FormViewV2.Content.Group title="Información">
              <Form.Input
                label="Nombre del producto"
                onChangeText={() => {}}
                value="Café molido premium"
              />
              <Form.Input label="SKU" onChangeText={() => {}} value="SKU-001" />
            </FormViewV2.Content.Group>
          ) : (
            <FormViewV2.Content.Section title="Movimientos">
              <Display.ListItem
                leading={<LeadingIcon name="arrow-down-outline" />}
                subtitle="2026-06-01 · Compra"
                title="Entrada · +48 u"
              />
              <Divider />
              <Display.ListItem
                leading={<LeadingIcon name="arrow-up-outline" />}
                showDivider={false}
                subtitle="2026-06-10 · Venta"
                title="Salida · −12 u"
              />
            </FormViewV2.Content.Section>
          )}
        </FormViewV2.Content>
      </FormViewV2.Root>
    </View>
  );
}

export const WithSegmented: Story = { render: () => <FormViewWithSegmentedStory /> };

/**
 * Catálogo de headers (Navigation.AppBar) usados por FormViewV2. AppBar directo
 * (sin contexto/scroll) para comparar cada variante aislada.
 */
export const HeaderVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <SectionLabel>1 · Tamaño + descripción</SectionLabel>

      <VariantFrame label="default — título solo (detalle compacto)">
        <Navigation.AppBar onBack={() => {}} safeArea={false} title="Producto #001" />
      </VariantFrame>

      <VariantFrame label="default + descripción (subtitle)">
        <Navigation.AppBar
          onBack={() => {}}
          safeArea={false}
          subtitle="Editar registro"
          title="Producto #001"
        />
      </VariantFrame>

      <VariantFrame label="large — título solo (root, sin back)">
        <Navigation.AppBar safeArea={false} title="Ajustes" variant="large" />
      </VariantFrame>

      <VariantFrame label="large + descripción (root)">
        <Navigation.AppBar
          safeArea={false}
          subtitle="Configuración general"
          title="Ajustes"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>2 · Navegación (back)</SectionLabel>

      <VariantFrame label="default + back (sub-pantalla)">
        <Navigation.AppBar
          onBack={() => {}}
          safeArea={false}
          subtitle="Paso 2 de 3"
          title="Datos de envío"
        />
      </VariantFrame>

      <VariantFrame label="large + back (sub-sección) — back inline con el título">
        <Navigation.AppBar
          onBack={() => {}}
          safeArea={false}
          title="Sub-sección"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>3 · Acciones — íconos (action buttons)</SectionLabel>

      <VariantFrame label="default + íconos (search · notificaciones · más)">
        <Navigation.AppBar
          actions={
            <>
              <Navigation.AppBar.Action icon="search" onPress={() => {}} />
              <Navigation.AppBar.Action
                badge={3}
                icon="notifications-outline"
                onPress={() => {}}
              />
              <Navigation.AppBar.Action icon="ellipsis-horizontal" onPress={() => {}} />
            </>
          }
          onBack={() => {}}
          safeArea={false}
          title="Producto #001"
        />
      </VariantFrame>

      <VariantFrame label="large + ícono tinted (acción inline junto al título)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          onBack={() => {}}
          safeArea={false}
          title="Productos"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>4 · Acciones — CTA con texto (editar / nuevo)</SectionLabel>

      <VariantFrame label="default + CTA 'Editar' (texto plain)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action label="Editar" onPress={() => {}} />}
          onBack={() => {}}
          safeArea={false}
          subtitle="Solo lectura"
          title="Producto"
        />
      </VariantFrame>

      <VariantFrame label="large + CTA 'Nuevo' (texto tinted, inline con título)">
        <Navigation.AppBar
          actions={
            <Navigation.AppBar.Action
              icon="add"
              label="Nuevo"
              onPress={() => {}}
              tone="tinted"
            />
          }
          safeArea={false}
          title="Clientes"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>5 · Subheader — búsqueda y ActionsBar</SectionLabel>

      <VariantFrame label="con búsqueda (SearchBar en subheader)">
        <Navigation.AppBar
          onBack={() => {}}
          safeArea={false}
          subheader={
            <Navigation.SearchBar
              onChangeText={() => {}}
              placeholder="Buscar producto"
              value=""
            />
          }
          title="Catálogo"
        />
      </VariantFrame>

      <VariantFrame label="ActionsBar sibling — Cancelar / Guardar (fondo barra + divisor)">
        <Navigation.AppBar onBack={() => {}} safeArea={false} title="Editar producto" />
        <DocActionsBar>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Cancelar" variant="outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Guardar" />
          </View>
        </DocActionsBar>
      </VariantFrame>

      <SectionLabel>6 · Tonos hero</SectionLabel>

      <VariantFrame label="center — modal / bottom-sheet / wizard step">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="close" onPress={() => {}} />}
          onBack={() => {}}
          safeArea={false}
          title="Nuevo pedido"
          variant="center"
        />
      </VariantFrame>

      <VariantFrame label="tone=dark — hero oscuro (balance / resumen)">
        <Navigation.AppBar
          actions={
            <Navigation.AppBar.Action
              icon="notifications-outline"
              onDark
              onPress={() => {}}
            />
          }
          safeArea={false}
          subtitle="Saldo disponible"
          title="Bs 12.480"
          tone="dark"
          variant="large"
        />
      </VariantFrame>

      <VariantFrame label="tone=gradient — CTA / saludo de bienvenida">
        <Navigation.AppBar
          actions={
            <Navigation.AppBar.Action icon="notifications-outline" onPress={() => {}} />
          }
          safeArea={false}
          subtitle="Tenés 3 pedidos pendientes"
          title="Buenos días, Andrés"
          tone="gradient"
          variant="large"
        />
      </VariantFrame>
    </View>
  ),
};
