import { Display } from "@sincpro/mobile-ui/Display";
import { Form } from "@sincpro/mobile-ui/Form";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";

const meta: Meta = { title: "Components/Inputs" };
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

function MonetaryDemo() {
  const [v, setV] = useState(0);
  return <Form.MonetaryInput amount={v} onChange={setV} placeholder="0.00" />;
}

export const Input: Story = { render: () => <InputDemo /> };

export const MonetaryInput: Story = { render: () => <MonetaryDemo /> };

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

function SwitchDemo() {
  const [on, setOn] = useState(true);
  const [off, setOff] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Form.Switch label="Notificaciones" onValueChange={setOn} value={on} />
      <Form.Switch label="Modo oscuro" onValueChange={setOff} value={off} />
      <Form.Switch disabled label="Deshabilitado" onValueChange={() => {}} value={false} />
    </View>
  );
}

function SelectDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Form.Select
      label="Sucursal"
      onChange={setValue}
      options={[
        { label: "La Paz", value: "lpz" },
        { label: "Santa Cruz", value: "scz" },
        { label: "Cochabamba", value: "cbb" },
      ]}
      placeholder="Elegí una sucursal"
      title="Sucursal"
      value={value}
    />
  );
}

function PinDemo() {
  const [code, setCode] = useState("");
  return <Form.PinInput length={6} onChange={setCode} value={code} />;
}

function SliderDemo() {
  const [price, setPrice] = useState(50);
  return (
    <Form.Slider
      formatValue={(v) => `Bs ${v}`}
      label="Precio máximo"
      max={200}
      min={0}
      onChange={setPrice}
      step={5}
      value={price}
    />
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  return (
    <View style={{ gap: 16 }}>
      <Form.DatePicker
        label="Fecha"
        onChange={setDate}
        placeholder="Elegí una fecha"
        value={date}
      />
      <Form.DatePicker
        label="Hora"
        mode="time"
        onChange={setTime}
        placeholder="Elegí una hora"
        value={time}
      />
    </View>
  );
}

export const Checkbox: Story = { render: () => <CheckboxDemo /> };

export const RadioButton: Story = { render: () => <RadioDemo /> };

export const Switch: Story = { render: () => <SwitchDemo /> };

export const Select: Story = { render: () => <SelectDemo /> };

export const PinInput: Story = { render: () => <PinDemo /> };

export const Slider: Story = { render: () => <SliderDemo /> };

export const DatePicker: Story = { render: () => <DatePickerDemo /> };

export const QuantitySelector: Story = { render: () => <QuantityDemo /> };

export const FilterButton: Story = { render: () => <FilterDemo /> };

function SearchHistoryDemo() {
  const [items, setItems] = useState(["pizza", "hamburguesa", "sushi", "helado"]);
  return (
    <Display.SearchHistory
      items={items}
      onClearAll={() => setItems([])}
      onRemove={(v) => setItems((prev) => prev.filter((x) => x !== v))}
      onSelect={() => {}}
    />
  );
}

export const SearchHistory: Story = { render: () => <SearchHistoryDemo /> };
