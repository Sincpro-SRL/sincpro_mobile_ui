import { theme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import React, { useEffect, useRef } from "react";
import { FlatList, Modal, TextInput, TouchableOpacity, View } from "react-native";

export interface EditableValueModalChip {
  key?: string;
  label: string;
  onPress: () => void;
}

export interface EditableValueModalProps {
  visible: boolean;
  title: string;
  value: string;
  onChangeValue: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder?: string;
  helperText?: string | React.ReactNode;
  chips?: EditableValueModalChip[];
  keyboardType?: "default" | "numeric" | "decimal-pad";
  rightAdornment?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  autoFocus?: boolean;
  testID?: string;
}

function EditableValueModal({
  visible,
  title,
  value,
  onChangeValue,
  onConfirm,
  onCancel,
  placeholder,
  helperText,
  chips,
  keyboardType = "decimal-pad",
  rightAdornment,
  confirmLabel = "Aplicar",
  cancelLabel = "Cancelar",
  autoFocus = true,
  testID,
}: EditableValueModalProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [visible, autoFocus]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-center p-6 bg-black/40">
        <View
          className="p-4"
          style={{ borderRadius: 22, backgroundColor: theme.bg.popover, ...theme.shadow.md }}
          testID={testID}
        >
          <Typography.Text className="mb-3" semibold variant="h6">
            {title}
          </Typography.Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-input rounded-lg p-2.5 text-lg text-text-primary"
              keyboardType={keyboardType}
              onChangeText={onChangeValue}
              onSubmitEditing={onConfirm}
              placeholder={placeholder}
              ref={inputRef}
              returnKeyType="done"
              value={value}
            />
            {rightAdornment && <View className="ml-2">{rightAdornment}</View>}
          </View>
          {helperText ? (
            <View className="mt-2">
              {typeof helperText === "string" ? (
                <Typography.Text className="opacity-70" variant="bodySmall">
                  {helperText}
                </Typography.Text>
              ) : (
                helperText
              )}
            </View>
          ) : null}
          {chips && chips.length > 0 && (
            <FlatList
              contentContainerClassName="gap-2 py-3"
              data={chips}
              horizontal
              keyExtractor={(c, i) => c.key || `${c.label}-${i}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-3 py-1.5 bg-accent/10 rounded-2xl border border-accent/30"
                  onPress={item.onPress}
                >
                  <Typography.Text semibold variant="bodySmall">
                    {item.label}
                  </Typography.Text>
                </TouchableOpacity>
              )}
            />
          )}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              className="px-4 py-2.5 rounded-lg bg-bg-hover"
              onPress={onCancel}
            >
              <Typography.Text semibold variant="body">
                {cancelLabel}
              </Typography.Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2.5 rounded-lg bg-accent"
              onPress={onConfirm}
            >
              <Typography.Text className="text-text-inverse" semibold variant="body">
                {confirmLabel}
              </Typography.Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default EditableValueModal;
