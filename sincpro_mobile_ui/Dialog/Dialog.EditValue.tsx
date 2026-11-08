import { FlashList } from "@shopify/flash-list";
import { Actions } from "@sincpro/mobile-ui/Actions";
import Sheet from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { fontFamilies, useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { attempt, errorMessage } from "@sincpro/mobile-ui/utils/async";
import { type ReactNode, useRef, useState } from "react";
import { Keyboard, TextInput, type TextInputProps, View } from "react-native";

export type EditValueOption = {
  key: string;
  label: string;
  value: string;
  disabled?: boolean;
};

export type EditValueProps = {
  visible: boolean;
  title: string;
  value: string;
  onChange?: (value: string) => void;
  onConfirm: (value: string) => void | Promise<void>;
  onClose: () => void;
  placeholder?: string;
  helperText?: ReactNode;
  options?: readonly EditValueOption[];
  keyboardType?: TextInputProps["keyboardType"];
  rightAdornment?: ReactNode;
  footerAdornment?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  testID?: string;
};

function EditValueEditor({
  title,
  value,
  onChange,
  onConfirm,
  onClose,
  placeholder,
  helperText,
  options = [],
  keyboardType = "decimal-pad",
  rightAdornment,
  footerAdornment,
  confirmLabel = "Aplicar",
  cancelLabel = "Cancelar",
  autoFocus = true,
  disabled = false,
  readOnly = false,
  onPendingChange,
}: EditValueProps & { onPendingChange: (pending: boolean) => void }) {
  const theme = useTheme();
  const saving = useRef(false);
  const [localDraft, setLocalDraft] = useState(value);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const draft = onChange ? value : localDraft;
  const blocked = disabled || readOnly || pending;
  const updateDraft = (next: string) => {
    if (blocked || saving.current) return;
    if (onChange) onChange(next);
    else setLocalDraft(next);
    setError(undefined);
  };
  const close = () => {
    if (saving.current) return;
    Keyboard.dismiss();
    onClose();
  };
  const save = async () => {
    if (disabled || readOnly || saving.current) return;
    saving.current = true;
    setPending(true);
    onPendingChange(true);
    setError(undefined);
    const result = await attempt(async () => {
      await onConfirm(draft);
      Keyboard.dismiss();
      onClose();
    });
    saving.current = false;
    setPending(false);
    onPendingChange(false);
    if (!result.ok) {
      setError(
        errorMessage(
          result.error,
          "No se pudo guardar. Conservamos el valor para reintentar.",
        ),
      );
    }
  };

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <View className="flex-row items-center gap-2">
        <TextInput
          accessibilityLabel={title}
          accessibilityState={{ disabled: blocked }}
          autoFocus={autoFocus && !blocked}
          className="flex-1 border border-input rounded-lg p-3 text-text-primary"
          editable={!blocked}
          keyboardType={keyboardType}
          onChangeText={updateDraft}
          onSubmitEditing={() => void save()}
          placeholder={placeholder}
          placeholderTextColor={theme.text.tertiary}
          readOnly={readOnly}
          returnKeyType="done"
          selectionColor={theme.primary}
          style={{ minHeight: 48, fontFamily: fontFamilies.regular, fontSize: 18 }}
          underlineColorAndroid="transparent"
          value={draft}
        />
        {rightAdornment}
      </View>
      {helperText ? (
        typeof helperText === "string" ? (
          <Typography.Text className="pt-2 text-text-secondary">{helperText}</Typography.Text>
        ) : (
          helperText
        )
      ) : null}
      <View style={{ flex: 1, minHeight: 0 }}>
        <FlashList
          contentContainerStyle={{ paddingVertical: 12 }}
          data={options}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(option) => option.key}
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="radio"
              accessibilityState={{
                disabled: blocked || !!item.disabled,
                selected: item.value === draft,
              }}
              className="border-b border-border-light py-3"
              disabled={blocked || item.disabled}
              onPress={() => {
                if (!item.disabled) updateDraft(item.value);
              }}
              style={{ minWidth: 48, minHeight: 48 }}
            >
              <Typography.Text
                className={item.disabled ? "text-text-disabled" : "text-text-primary"}
                semibold={item.value === draft}
              >
                {item.label}
              </Typography.Text>
            </Pressable>
          )}
        />
      </View>
      {error ? (
        <Typography.Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="pb-3 text-danger"
          selectable
        >
          {error}
        </Typography.Text>
      ) : null}
      <View className="gap-2 border-t border-border-light py-3">
        {footerAdornment ? (
          <View
            accessibilityElementsHidden={blocked}
            importantForAccessibility={blocked ? "no-hide-descendants" : "auto"}
            pointerEvents={blocked ? "none" : "auto"}
          >
            {footerAdornment}
          </View>
        ) : null}
        <Actions.Button
          disabled={pending}
          onPress={close}
          title={cancelLabel}
          variant="secondary"
        />
        <Actions.Button
          disabled={blocked}
          loading={pending}
          onPress={() => void save()}
          title={confirmLabel}
        />
      </View>
    </View>
  );
}

function EditValue(props: EditValueProps) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  return (
    <Sheet
      dismissible={!pending}
      onClose={() => {
        if (!busy.current) {
          Keyboard.dismiss();
          props.onClose();
        }
      }}
      scrollable={false}
      testID={props.testID}
      title={props.title}
      visible={props.visible}
    >
      {props.visible ? (
        <EditValueEditor
          {...props}
          onPendingChange={(next) => {
            busy.current = next;
            setPending(next);
          }}
        />
      ) : null}
    </Sheet>
  );
}

export default EditValue;
