import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";

const meta: Meta = { title: "Legacy/Inputs" };
export default meta;

type Story = StoryObj;

// @deprecated — Form.SearchBar. Replaced by Navigation.SearchBar (2026 pill).
function SearchBarDemo() {
  const [q, setQ] = useState("");
  return <Form.SearchBar onChangeText={setQ} placeholder="Buscar..." value={q} />;
}

export const SearchBarLegacy: Story = { render: () => <SearchBarDemo /> };
