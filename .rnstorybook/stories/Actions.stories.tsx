import { Actions } from "@sincpro/mobile-ui/Actions";
import { Display } from "@sincpro/mobile-ui/Display";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Actions" };
export default meta;

type Story = StoryObj;

// ─── Button ───────────────────────────────────────────────────────────────────

export const Buttons: Story = {
  name: "Button — variants",
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button onPress={() => {}} title="primary (default)" />
      <Actions.Button onPress={() => {}} title="accent" variant="accent" />
      <Actions.Button onPress={() => {}} title="secondary" variant="secondary" />
      <Actions.Button onPress={() => {}} title="outline" variant="outline" />
      <Actions.Button onPress={() => {}} title="outlineDanger" variant="outlineDanger" />
      <Actions.Button onPress={() => {}} title="flat" variant="flat" />
      <Actions.Button onPress={() => {}} title="link" variant="link" />
      <Actions.Button loading onPress={() => {}} title="loading…" />
      <Actions.Button disabled onPress={() => {}} title="disabled" />
    </View>
  ),
};

export const ButtonSizes: Story = {
  name: "Button — sizes",
  render: () => (
    <View style={{ gap: 12 }}>
      <Actions.Button onPress={() => {}} size="small" title="small" />
      <Actions.Button onPress={() => {}} size="medium" title="medium (default)" />
      <Actions.Button onPress={() => {}} size="large" title="large" />
    </View>
  ),
};

// ─── IconButton ───────────────────────────────────────────────────────────────

export const IconButtons: Story = {
  name: "IconButton",
  render: () => (
    <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
      <Actions.IconButton icon="add" onPress={() => {}} type="ionicons" />
      <Actions.IconButton
        icon="trash"
        onPress={() => {}}
        type="ionicons"
        variant="secondary"
      />
      <Actions.IconButton
        icon="share-outline"
        onPress={() => {}}
        type="ionicons"
        variant="primary"
      />
      <Actions.IconButton
        icon="settings-outline"
        onPress={() => {}}
        rounded
        type="ionicons"
      />
    </View>
  ),
};

// ─── FAB ─────────────────────────────────────────────────────────────────────

export const FABStory: Story = {
  name: "FAB",
  render: () => (
    <View style={{ height: 200 }}>
      <Actions.FAB icon="add" onPress={() => {}} />
      <Actions.FAB icon="create" label="Nuevo" onPress={() => {}} position="bottom-left" />
    </View>
  ),
};

// ─── FilterButton ─────────────────────────────────────────────────────────────

function FilterDemo() {
  const [active, setActive] = useState("all");
  const options = ["all", "active", "done", "error"];
  return (
    <Actions.FilterButtonGroup>
      {options.map((opt) => (
        <Actions.FilterButton
          active={active === opt}
          key={opt}
          onPress={() => setActive(opt)}
          title={
            opt === "all"
              ? "Todos"
              : opt === "active"
                ? "Activos"
                : opt === "done"
                  ? "Listos"
                  : "Error"
          }
        />
      ))}
    </Actions.FilterButtonGroup>
  );
}

export const FilterButtons: Story = {
  name: "FilterButton",
  render: () => <FilterDemo />,
};

// ─── CircleButton ─────────────────────────────────────────────────────────────

export const CircleButtonStory: Story = {
  name: "CircleButton",
  render: () => (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <Display.CircleButton customIcon={HomeIcon} size="sm" />
        <Display.CircleButton customIcon={HomeIcon} size="md" />
        <Display.CircleButton customIcon={HomeIcon} size="lg" />
      </View>
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <Display.CircleButton customIcon={ProfileIcon} size="md" variant="primary" />
        <Display.CircleButton customIcon={BoxTimeIcon} size="md" variant="danger" />
        <Display.CircleButton customIcon={SettingsIcon} size="md" variant="success" />
      </View>
    </View>
  ),
};
