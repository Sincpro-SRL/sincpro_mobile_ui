import Button from "@sincpro/mobile-ui/Actions/Actions.Button";
import IconButton from "@sincpro/mobile-ui/Actions/Actions.IconButton";
import NativeSheet from "@sincpro/mobile-ui/Dialog/Dialog.NativeSheet";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Card from "@sincpro/mobile-ui/Display/Display.Card";
import CopyableText from "@sincpro/mobile-ui/Display/Display.CopyableText";
import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import DisplayImage from "@sincpro/mobile-ui/Display/Display.Image";
import ListGroup from "@sincpro/mobile-ui/Display/Display.ListGroup";
import ListItem from "@sincpro/mobile-ui/Display/Display.ListItem";
import EmptyState from "@sincpro/mobile-ui/Feedback/Feedback.EmptyState";
import Checkbox from "@sincpro/mobile-ui/Form/Form.Checkbox";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { FilterBar } from "@sincpro/mobile-ui/widgets/FilterBar";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { Keyboard, View } from "react-native";

const meta = {
  title: "Patterns/Collections/Browsing",
  excludeStories: ["CollectionRecipe"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const artwork = require("../../assets/brand-mesh.png");
const records = [
  {
    id: "guide",
    title: "Guía de inicio",
    subtitle: "Primeros pasos",
    pending: true,
    image: true,
    featured: false,
  },
  {
    id: "reference",
    title: "Referencia visual",
    subtitle: "Recursos de diseño",
    pending: false,
    image: true,
    featured: true,
  },
  {
    id: "notes",
    title: "Notas del equipo",
    subtitle: "Ideas por revisar",
    pending: true,
    image: false,
    featured: false,
  },
];
const filterDefinitions = [
  { id: "pending", label: "Pendientes" },
  { id: "image", label: "Con imagen" },
  { id: "saved", label: "Guardados" },
];

export function CollectionRecipe({
  cards = false,
  long = false,
}: {
  cards?: boolean;
  long?: boolean;
}) {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [detail, setDetail] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [featuredDraft, setFeaturedDraft] = useState(false);
  const selected = records.find((record) => record.id === detail);
  const visible = records.filter(
    (record) =>
      record.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
      (!active.includes("pending") || record.pending) &&
      (!active.includes("image") || record.image) &&
      (!active.includes("saved") || saved.includes(record.id)) &&
      (!active.includes("featured") || record.featured),
  );
  const toggleSaved = (id: string) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const thumbnail = (image: boolean) => (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {image ? (
        <DisplayImage height={56} source={artwork} width={56} />
      ) : (
        <View
          className="bg-container-primary rounded-lg items-center justify-center"
          style={{ width: 56, height: 56 }}
        >
          <Icon color={theme.container.onPrimary} name="document-text-outline" size={24} />
        </View>
      )}
    </View>
  );
  const saveAction = (record: (typeof records)[number]) => (
    <IconButton
      accessibilityLabel={`${saved.includes(record.id) ? "Quitar de guardados" : "Guardar"} ${record.title}`}
      accessibilityState={{ selected: saved.includes(record.id) }}
      icon={saved.includes(record.id) ? "bookmark" : "bookmark-outline"}
      onPress={() => toggleSaved(record.id)}
      type="ionicons"
    />
  );

  return (
    <View style={{ gap: 24 }}>
      <Typography.Heading variant="h3">Explorar</Typography.Heading>
      <FilterBar
        filters={[
          ...filterDefinitions,
          ...(active.includes("featured") ? [{ id: "featured", label: "Destacados" }] : []),
        ].map((filter) => ({
          ...filter,
          selected: active.includes(filter.id),
          label:
            long && filter.id === "pending"
              ? "Pendientes de revisión por el equipo"
              : filter.label,
        }))}
        onClearFilters={() => setActive([])}
        onFilterPress={(id) => {
          Keyboard.dismiss();
          setActive((current) =>
            current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
          );
        }}
        onOpenFilters={() => {
          Keyboard.dismiss();
          setFeaturedDraft(active.includes("featured"));
          setMoreOpen(true);
        }}
        resultsLabel={`${visible.length} ${visible.length === 1 ? "resultado" : "resultados"}`}
        search={{
          accessibilityLabel: "Buscar recursos",
          clearAccessibilityLabel: "Limpiar búsqueda",
          value: query,
          onChangeText: setQuery,
          placeholder: "Buscar por título",
          testID: "composition-search",
        }}
        testID="collection-filters"
      />
      {visible.length === 0 ? (
        <EmptyState
          actionLabel="Restablecer búsqueda"
          description="Prueba otro título o cambia los filtros."
          onAction={() => {
            setActive([]);
            setQuery("");
          }}
          title="Sin resultados"
        />
      ) : cards ? (
        <View style={{ gap: 16 }}>
          {visible.map((record) => (
            <Card elevation="none" key={record.id}>
              <View className="flex-row items-start gap-3">
                {thumbnail(record.image)}
                <View className="flex-1 gap-1">
                  <Typography.Text variant="body">{record.title}</Typography.Text>
                  <Typography.Text className="text-text-secondary" variant="bodySmall">
                    {record.subtitle}
                  </Typography.Text>
                </View>
              </View>
              <View className="flex-row flex-wrap items-center gap-2 mt-4">
                <Button
                  accessibilityLabel={`Abrir ${record.title}`}
                  onPress={() => setDetail(record.id)}
                  title="Ver detalle"
                  variant="secondary"
                />
                {saveAction(record)}
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <ListGroup surface="plain" title="Recursos">
          {visible.map((record) => (
            <View className="flex-row items-center" key={record.id}>
              <ListItem
                accessibilityLabel={`Abrir ${record.title}`}
                chevron
                className="flex-1"
                leading={thumbnail(record.image)}
                onPress={() => setDetail(record.id)}
                subtitle={record.subtitle}
                title={record.title}
                variant="mobile"
              />
              {saveAction(record)}
            </View>
          ))}
        </ListGroup>
      )}
      <Typography.Text className="text-text-secondary" variant="bodySmall">
        Datos e ilustraciones locales de demostración.
      </Typography.Text>
      <Sheet
        onClose={() => setMoreOpen(false)}
        showCloseButton
        title="Más filtros"
        visible={moreOpen}
      >
        <View style={{ gap: 16 }}>
          <Checkbox
            isChecked={featuredDraft}
            mainText="Solo destacados"
            onCheck={setFeaturedDraft}
          />
          <Button
            onPress={() => {
              setActive((current) =>
                featuredDraft
                  ? [...current.filter((id) => id !== "featured"), "featured"]
                  : current.filter((id) => id !== "featured"),
              );
              setMoreOpen(false);
            }}
            title="Aplicar filtros"
          />
        </View>
      </Sheet>
      <NativeSheet
        onClose={() => setDetail(null)}
        title={selected?.title ?? "Detalle del recurso"}
        visible={selected !== undefined}
      >
        {selected ? (
          <View style={{ gap: 16 }}>
            {thumbnail(selected.image)}
            <Typography.Text variant="bodyReadable">
              {selected.subtitle}. Un ejemplo de cómo combinar una imagen de apoyo, contenido
              legible y acciones independientes.
            </Typography.Text>
            <CopyableText value={`REF-${selected.id.toUpperCase()}`} />
            <Button
              onPress={() => toggleSaved(selected.id)}
              title={
                saved.includes(selected.id)
                  ? "Quitar de mi selección"
                  : "Guardar en mi selección"
              }
              variant="secondary"
            />
          </View>
        ) : null}
      </NativeSheet>
    </View>
  );
}

export const Rows: Story = { render: () => <CollectionRecipe /> };
export const Cards: Story = { render: () => <CollectionRecipe cards /> };
export const LongContent: Story = { render: () => <CollectionRecipe long /> };
