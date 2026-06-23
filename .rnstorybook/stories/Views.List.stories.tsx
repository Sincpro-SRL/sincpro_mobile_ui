/**
 * Views/List — ListViewV2: contenedor de una colección (lista / índice / resultados).
 *
 * Cada story muestra UNA capacidad de la API. Las piezas de fila (Content.Row…)
 * viven en `Views/List/Content`.
 *
 * Nota: las stories renderizan filas directas (sin FlatList) para evitar el warning
 * VirtualizedList-in-ScrollView del decorator de Storybook.
 */
import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import { Navigation } from "@sincpro/mobile-ui/Navigation";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import ListViewV2 from "@sincpro/mobile-ui/views/ListViewV2";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

import {
  CATEGORY_FILTERS,
  DocActionsBar,
  INVENTORY_ITEMS,
  LeadingIcon,
  SectionLabel,
  VariantFrame,
} from "./views.helpers";

const meta: Meta = { title: "Views/List" };
export default meta;
type Story = StoryObj;

/**
 * API: variant="large" · SearchBar en subheader · Filters chips sibling · acción tinted
 */
function ListViewLargeHeaderStory() {
  const [filter, setFilter] = useState("Todos");
  return (
    <View style={{ alignSelf: "stretch" }}>
      <ListViewV2.Root items={[]} name="Inventario" onSearch={() => {}}>
        {/* Header large: sin bg card, título grande, acción tinted verde */}
        <ListViewV2.Header
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          variant="large"
        >
          {/* subheader slot → SearchBar */}
          <ListViewV2.Header.Search />
        </ListViewV2.Header>

        {/* Filters: sibling del Header — barra debajo del AppBar */}
        <ListViewV2.Header.Filters>
          <ListViewV2.Header.Filters.Chips>
            {CATEGORY_FILTERS.map((f) => (
              <ListViewV2.Header.Filters.Chip
                active={filter === f}
                key={f}
                label={f}
                onPress={() => setFilter(f)}
              />
            ))}
          </ListViewV2.Header.Filters.Chips>
        </ListViewV2.Header.Filters>

        {/* Rows directos (sin FlatList) */}
        <View style={{ backgroundColor: theme.bg.card }}>
          {INVENTORY_ITEMS.map((item, i) => (
            <ListViewV2.Content.Row
              key={item.id}
              onPress={() => {}}
              showDivider={i < INVENTORY_ITEMS.length - 1}
            >
              <ListViewV2.Content.Row.Avatar>
                <LeadingIcon name="cube-outline" />
              </ListViewV2.Content.Row.Avatar>
              <ListViewV2.Content.Row.Content>
                <ListViewV2.Content.Row.Title
                  rightComponent={
                    <Typography.Text
                      style={{ color: item.ok ? theme.accent : theme.text.secondary }}
                      variant="captionSmall"
                    >
                      {item.ok ? "Disponible" : "Bajo stock"}
                    </Typography.Text>
                  }
                >
                  {item.name}
                </ListViewV2.Content.Row.Title>
                <ListViewV2.Content.Row.Subtitle>{item.sku}</ListViewV2.Content.Row.Subtitle>
              </ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Actions>
                <Typography.Text variant="data">{item.qty}</Typography.Text>
              </ListViewV2.Content.Row.Actions>
            </ListViewV2.Content.Row>
          ))}
        </View>
      </ListViewV2.Root>
    </View>
  );
}

export const LargeHeader: Story = { render: () => <ListViewLargeHeaderStory /> };

/**
 * API: variant="default" · ActionsBar como SIBLING (no children del Header) · rows checkables
 */
function ListViewWithActionsBarStory() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <View style={{ alignSelf: "stretch" }}>
      <ListViewV2.Root items={[]} name="Pedidos" onBack={() => {}}>
        {/* Header compact (default) */}
        <ListViewV2.Header
          actions={<Navigation.AppBar.Action icon="filter-outline" onPress={() => {}} />}
          variant="default"
        />

        {/* ActionsBar: SIBLING del Header — barra secundaria debajo del AppBar */}
        <ListViewV2.Header.ActionsBar>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Seleccionar todo" variant="outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Form.Button
              onPress={() => {}}
              title={`Eliminar (${selected.length})`}
              variant="outline"
            />
          </View>
        </ListViewV2.Header.ActionsBar>

        <View style={{ backgroundColor: theme.bg.card, marginTop: 2 }}>
          {INVENTORY_ITEMS.map((item, i) => (
            <ListViewV2.Content.Row
              backgroundColor={selected.includes(item.id) ? theme.bg.muted : undefined}
              key={item.id}
              onPress={() => toggle(item.id)}
              showDivider={i < INVENTORY_ITEMS.length - 1}
            >
              <ListViewV2.Content.Row.Avatar>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: selected.includes(item.id)
                      ? theme.accent
                      : theme.border.default,
                    backgroundColor: selected.includes(item.id)
                      ? theme.accent
                      : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected.includes(item.id) ? (
                    <Display.Icon color="#fff" name="checkmark" size={13} type="ionicons" />
                  ) : null}
                </View>
              </ListViewV2.Content.Row.Avatar>
              <ListViewV2.Content.Row.Content>
                <ListViewV2.Content.Row.Title>{item.name}</ListViewV2.Content.Row.Title>
                <ListViewV2.Content.Row.Subtitle>{item.sku}</ListViewV2.Content.Row.Subtitle>
              </ListViewV2.Content.Row.Content>
            </ListViewV2.Content.Row>
          ))}
        </View>
      </ListViewV2.Root>
    </View>
  );
}

export const WithActionsBar: Story = { render: () => <ListViewWithActionsBarStory /> };

/**
 * API: ListViewV2.FloatingButton — posición absolute bottom-right sobre la lista.
 * FloatingButton es un contenedor absolute; el hijo define el botón.
 */
function ListViewWithFloatingButtonStory() {
  return (
    <View style={{ alignSelf: "stretch", height: 500 }}>
      <ListViewV2.Root items={[]} name="Productos" onBack={() => {}}>
        <ListViewV2.Header
          actions={<Navigation.AppBar.Action icon="search" onPress={() => {}} />}
          variant="large"
        />

        {/* View con flex:1 necesario para que FloatingButton se posicione correctamente */}
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: theme.bg.card }}>
            {INVENTORY_ITEMS.map((item, i) => (
              <ListViewV2.Content.Row
                key={item.id}
                onPress={() => {}}
                showDivider={i < INVENTORY_ITEMS.length - 1}
              >
                <ListViewV2.Content.Row.Avatar>
                  <LeadingIcon name="cube-outline" />
                </ListViewV2.Content.Row.Avatar>
                <ListViewV2.Content.Row.Content>
                  <ListViewV2.Content.Row.Title>{item.name}</ListViewV2.Content.Row.Title>
                  <ListViewV2.Content.Row.Subtitle>
                    {item.sku}
                  </ListViewV2.Content.Row.Subtitle>
                </ListViewV2.Content.Row.Content>
                <ListViewV2.Content.Row.Actions>
                  <Typography.Text variant="data">{item.qty}</Typography.Text>
                </ListViewV2.Content.Row.Actions>
              </ListViewV2.Content.Row>
            ))}
          </View>

          {/* FloatingButton: absolute sobre el contenido */}
          <ListViewV2.FloatingButton>
            <Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />
          </ListViewV2.FloatingButton>
        </View>
      </ListViewV2.Root>
    </View>
  );
}

export const WithFloatingButton: Story = {
  render: () => <ListViewWithFloatingButtonStory />,
};

/**
 * API: ListViewV2.Header.Segmented — segmenta la lista por estado (Activos / Archivados)
 * desde el subheader, sobre un header large.
 */
function ListViewWithSegmentedStory() {
  const [seg, setSeg] = useState<"activos" | "archivados">("activos");
  const rows = seg === "activos" ? INVENTORY_ITEMS.slice(0, 3) : INVENTORY_ITEMS.slice(3);
  return (
    <View style={{ alignSelf: "stretch" }}>
      <ListViewV2.Root items={[]} name="Productos">
        <ListViewV2.Header variant="large">
          <ListViewV2.Header.Segmented
            onChange={setSeg}
            options={[
              { label: "Activos", value: "activos" },
              { label: "Archivados", value: "archivados" },
            ]}
            value={seg}
          />
        </ListViewV2.Header>

        <View style={{ backgroundColor: theme.bg.card }}>
          {rows.map((item, i) => (
            <ListViewV2.Content.Row
              key={item.id}
              onPress={() => {}}
              showDivider={i < rows.length - 1}
            >
              <ListViewV2.Content.Row.Avatar>
                <LeadingIcon name="cube-outline" />
              </ListViewV2.Content.Row.Avatar>
              <ListViewV2.Content.Row.Content>
                <ListViewV2.Content.Row.Title>{item.name}</ListViewV2.Content.Row.Title>
                <ListViewV2.Content.Row.Subtitle>{item.sku}</ListViewV2.Content.Row.Subtitle>
              </ListViewV2.Content.Row.Content>
              <ListViewV2.Content.Row.Actions>
                <Typography.Text variant="data">{item.qty}</Typography.Text>
              </ListViewV2.Content.Row.Actions>
            </ListViewV2.Content.Row>
          ))}
        </View>
      </ListViewV2.Root>
    </View>
  );
}

export const WithSegmented: Story = { render: () => <ListViewWithSegmentedStory /> };

/**
 * API: ListViewV2.Header.Search + ListViewV2.Header.SearchHistory (sibling).
 * El historial se muestra mientras el query está vacío; al escribir/seleccionar se oculta.
 */
function ListViewSearchWithHistoryStory() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Café molido", "Té verde orgánico", "Azúcar morena"]);
  const results = INVENTORY_ITEMS.filter((i) =>
    query ? i.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <View style={{ alignSelf: "stretch" }}>
      <ListViewV2.Root items={[]} name="Productos" onSearch={setQuery}>
        <ListViewV2.Header variant="large">
          <ListViewV2.Header.Search />
        </ListViewV2.Header>

        {/* Historial: sibling, visible solo cuando el query está vacío */}
        {query.length === 0 ? (
          <ListViewV2.Header.SearchHistory
            items={recent}
            onClearAll={() => setRecent([])}
            onRemove={(v) => setRecent((r) => r.filter((x) => x !== v))}
            onSelect={(v) => setQuery(v)}
          />
        ) : (
          <View style={{ backgroundColor: theme.bg.card }}>
            {results.map((item, i) => (
              <ListViewV2.Content.Row
                key={item.id}
                onPress={() => {}}
                showDivider={i < results.length - 1}
              >
                <ListViewV2.Content.Row.Avatar>
                  <LeadingIcon name="cube-outline" />
                </ListViewV2.Content.Row.Avatar>
                <ListViewV2.Content.Row.Content>
                  <ListViewV2.Content.Row.Title>{item.name}</ListViewV2.Content.Row.Title>
                  <ListViewV2.Content.Row.Subtitle>
                    {item.sku}
                  </ListViewV2.Content.Row.Subtitle>
                </ListViewV2.Content.Row.Content>
              </ListViewV2.Content.Row>
            ))}
          </View>
        )}
      </ListViewV2.Root>
    </View>
  );
}

export const SearchWithHistory: Story = { render: () => <ListViewSearchWithHistoryStory /> };

/**
 * Catálogo de headers (Navigation.AppBar) usados por ListViewV2. AppBar directo
 * (sin contexto/scroll) para comparar cada variante aislada.
 */
export const HeaderVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <SectionLabel>1 · Índice principal (large, sin back)</SectionLabel>

      <VariantFrame label="large root — título solo">
        <Navigation.AppBar safeArea={false} title="Inventario" variant="large" />
      </VariantFrame>

      <VariantFrame label="large root + CTA 'Nuevo' (texto tinted inline)">
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
          subtitle="124 artículos"
          title="Inventario"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>2 · Búsqueda</SectionLabel>

      <VariantFrame label="large + SearchBar (subheader)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          safeArea={false}
          subheader={
            <Navigation.SearchBar
              onChangeText={() => {}}
              placeholder="Buscar inventario"
              value=""
            />
          }
          title="Inventario"
          variant="large"
        />
      </VariantFrame>

      <VariantFrame label="default + ícono de búsqueda (lista compacta / resultados)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="search" onPress={() => {}} />}
          onBack={() => {}}
          safeArea={false}
          subtitle="Resultados filtrados"
          title="Productos"
        />
      </VariantFrame>

      <SectionLabel>3 · Navegación / sub-listas</SectionLabel>

      <VariantFrame label="large + back (sub-lista / categoría)">
        <Navigation.AppBar
          actions={<Navigation.AppBar.Action icon="add" onPress={() => {}} tone="tinted" />}
          onBack={() => {}}
          safeArea={false}
          title="Bebidas"
          variant="large"
        />
      </VariantFrame>

      <SectionLabel>4 · Selección múltiple (ActionsBar)</SectionLabel>

      <VariantFrame label="default + ActionsBar sibling — bulk (Cancelar / Confirmar)">
        <Navigation.AppBar onBack={() => {}} safeArea={false} title="Seleccionar" />
        <DocActionsBar>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Cancelar" variant="outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Form.Button onPress={() => {}} title="Confirmar (3)" />
          </View>
        </DocActionsBar>
      </VariantFrame>
    </View>
  ),
};
