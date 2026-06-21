import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Form" };
export default meta;

type Story = StoryObj;

function InputDemo() {
  const [value, setValue] = useState("");
  return (
    <Form.Input
      label="Nombre"
      onChangeText={setValue}
      placeholder="Escribe tu nombre"
      value={value}
    />
  );
}

function SearchBarDemo() {
  const [q, setQ] = useState("");
  return <Form.SearchBar onChangeText={setQ} placeholder="Buscar..." value={q} />;
}

function MonetaryDemo() {
  const [v, setV] = useState(0);
  return <Form.MonetaryInput amount={v} onChange={setV} placeholder="0.00" />;
}

export const Input: Story = { render: () => <InputDemo /> };

export const SearchBar: Story = { render: () => <SearchBarDemo /> };

export const MonetaryInput: Story = { render: () => <MonetaryDemo /> };

export const IconButtons: Story = {
  render: () => (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <Form.IconButton icon="add" onPress={() => {}} type="ionicons" />
      <Form.IconButton icon="trash" onPress={() => {}} type="ionicons" />
    </View>
  ),
};

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Form.Checkbox isChecked={checked} mainText="Acepto los términos" onCheck={setChecked} />
  );
}

function RadioDemo() {
  const [sel, setSel] = useState("a");
  return (
    <View style={{ gap: 8 }}>
      <Form.RadioButton label="Opción A" onPress={() => setSel("a")} selected={sel === "a"} />
      <Form.RadioButton label="Opción B" onPress={() => setSel("b")} selected={sel === "b"} />
    </View>
  );
}

function QuantityDemo() {
  const [qty, setQty] = useState(1);
  return <Form.QuantitySelector min={0} onChange={setQty} value={qty} />;
}

function FilterDemo() {
  const [active, setActive] = useState("todos");
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Form.FilterButton
        active={active === "todos"}
        onPress={() => setActive("todos")}
        title="Todos"
      />
      <Form.FilterButton
        active={active === "abiertos"}
        onPress={() => setActive("abiertos")}
        title="Abiertos"
      />
    </View>
  );
}

export const Checkbox: Story = { render: () => <CheckboxDemo /> };

export const RadioButton: Story = { render: () => <RadioDemo /> };

export const QuantitySelector: Story = { render: () => <QuantityDemo /> };

export const FilterButton: Story = { render: () => <FilterDemo /> };
