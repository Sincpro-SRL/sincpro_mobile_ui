import type { ReactElement } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
  type RegisterOptions,
} from "react-hook-form";

export interface FieldRenderProps<V> {
  value: V;
  onChange: (value: V) => void;
  onBlur: () => void;
  /** The explicit `error` prop, otherwise the validation message. */
  error?: string;
  disabled?: boolean;
}

export type FieldRules<T extends FieldValues, N extends Path<T>> = Omit<
  RegisterOptions<T, N>,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
>;

export interface FieldProps<T extends FieldValues, N extends Path<T>> {
  control: Control<T>;
  name: N;
  rules?: FieldRules<T, N>;
  /** Wins over the validation message, e.g. a server-side error. */
  error?: string;
  render: (field: FieldRenderProps<PathValue<T, N>>) => ReactElement;
}

/**
 * The one react-hook-form adapter of the DS. Any control (DS or app) becomes a
 * form field with typed value, blur, validation message and disabled state.
 */
export default function Field<T extends FieldValues, N extends Path<T>>({
  control,
  name,
  rules,
  error,
  render,
}: FieldProps<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) =>
        render({
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
          error: error ?? fieldState.error?.message,
          disabled: field.disabled,
        })
      }
      rules={rules}
    />
  );
}
