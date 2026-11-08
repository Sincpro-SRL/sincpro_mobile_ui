import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useState } from "react";
import { View } from "react-native";

export interface QueryChoiceProps<T extends string | number | boolean> {
  label: string;
  value: T | undefined;
  options: readonly { label: string; value: T }[];
  onChange: (value: T) => void;
}

export default function QueryChoice<T extends string | number | boolean>({
  label,
  value,
  options,
  onChange,
}: QueryChoiceProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <View className="gap-1">
      <Pressable
        accessibilityLabel={`${label}: ${selected?.label ?? "Seleccionar"}`}
        accessibilityState={{ expanded: open }}
        className="rounded-lg border border-input px-3 py-2"
        onPress={() => setOpen(!open)}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        <Typography.Text className="text-text-secondary" variant="bodySmall">
          {label}
        </Typography.Text>
        <Typography.Text variant="body">
          {selected?.label ?? "Seleccionar"} {open ? "−" : "+"}
        </Typography.Text>
      </Pressable>
      {open ? (
        <View accessibilityRole="radiogroup" className="border-l border-border-default pl-3">
          {options.map((option) => (
            <Pressable
              accessibilityLabel={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: option.value === value }}
              key={String(option.value)}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={{ minHeight: 48, justifyContent: "center" }}
            >
              <Typography.Text
                className={option.value === value ? "text-text-accent" : "text-text-primary"}
                variant="body"
              >
                {option.value === value ? "✓ " : ""}
                {option.label}
              </Typography.Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
