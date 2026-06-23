/**
 * Shared helpers + sample data for the Views/Form and Views/List stories.
 * NOT a story file (no `.stories` suffix) so Storybook's glob skips it.
 */
import { Display } from "@sincpro/mobile-ui/Display";
import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import React from "react";
import { View } from "react-native";

export function LeadingIcon({ name, color }: { name: string; color?: string }) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.bg.muted,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Display.Icon
        color={color ?? theme.icon.primary}
        name={name}
        size={18}
        type="ionicons"
      />
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: theme.border.light }} />;
}

/** Labeled frame around a single header variant (header-variants catalog). */
export function VariantFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Typography.Text style={{ color: theme.text.secondary }} variant="captionSmall">
        {label}
      </Typography.Text>
      <View
        style={{
          borderColor: theme.border.light,
          borderRadius: 12,
          borderWidth: 1,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

/** Group separator for the header-variants catalog. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography.Text
      semibold
      style={{ color: theme.text.primary, marginTop: 12 }}
      variant="caption"
    >
      {children}
    </Typography.Text>
  );
}

/** Secondary action bar (sibling of the Header) — mirrors {Form,List}ViewV2.Header.ActionsBar. */
export function DocActionsBar({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-bg-card px-4 pt-1 pb-3 border-b border-border-light flex-row gap-2 items-center">
      {children}
    </View>
  );
}

export function KeyValueRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
      }}
    >
      <Typography.Text variant="caption">{label}</Typography.Text>
      <Typography.Text variant={mono ? "data" : "bodySmall"}>{value}</Typography.Text>
    </View>
  );
}

// ─── sample data ─────────────────────────────────────────────────────────────

export const INVENTORY_ITEMS = [
  { id: "1", name: "Café molido premium", sku: "SKU-001", qty: "48 u", ok: true },
  { id: "2", name: "Té verde orgánico", sku: "SKU-002", qty: "12 u", ok: false },
  { id: "3", name: "Azúcar morena 1kg", sku: "SKU-003", qty: "0 u", ok: false },
  { id: "4", name: "Miel de abeja 500g", sku: "SKU-004", qty: "30 u", ok: true },
] as const;

export const CATEGORY_FILTERS = ["Todos", "Disponibles", "Bajo stock", "Agotados"] as const;

export const CATEGORIES = [
  { label: "Alimentos", value: "food" },
  { label: "Bebidas", value: "drinks" },
  { label: "Limpieza", value: "cleaning" },
];
