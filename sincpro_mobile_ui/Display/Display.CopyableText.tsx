import Icon from "@sincpro/mobile-ui/Display/Display.Icon";
import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, ActivityIndicator, View } from "react-native";

export type CopyableTextProps = (
  | {
      value: string;
      getValue?: never;
      label?: string;
      className?: string;
    }
  | {
      value?: never;
      getValue: () => string;
      label?: string;
      className?: string;
    }
) & {
  accessibilityLabel?: string;
  testID?: string;
  disabled?: boolean;
  onCopied?: (value: string) => void;
  onCopyError?: (error: Error) => void;
  selectable?: boolean;
};

function CopyableText({
  value,
  getValue,
  label,
  className,
  accessibilityLabel,
  testID,
  disabled = false,
  onCopied,
  onCopyError,
  selectable = false,
}: CopyableTextProps) {
  const theme = useTheme();
  const pending = useRef(false);
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const [copiedValue, setCopiedValue] = useState<string>();
  const hasStaticValue = value !== undefined;
  const isCopied = status === "copied" && (!hasStaticValue || copiedValue === value);
  const displayText = label || value || "Copiar";
  const copyLabel = accessibilityLabel ?? `Copiar ${displayText}`;

  useEffect(() => {
    if (status !== "copied") return;
    const timer = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleCopy = async () => {
    if (pending.current || disabled) return;
    pending.current = true;
    setStatus("copying");
    let textToCopy: string;
    try {
      textToCopy = hasStaticValue ? value : getValue();
      const copied = await Clipboard.setStringAsync(textToCopy);
      if (!copied) throw new Error("El portapapeles no pudo copiar el texto");
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      setStatus("error");
      AccessibilityInfo.announceForAccessibility("No se pudo copiar. Toca para reintentar.");
      pending.current = false;
      console.error("CopyableText: no se pudo copiar", error);
      onCopyError?.(error);
      return;
    }
    pending.current = false;
    setCopiedValue(textToCopy);
    setStatus("copied");
    AccessibilityInfo.announceForAccessibility("Copiado");
    onCopied?.(textToCopy);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: selectable ? "flex-start" : "center",
          gap: 8,
        }}
      >
        {selectable ? (
          <Typography.SelectableText
            className={className}
            style={{ flex: 1 }}
            value={displayText}
            variant="body"
          />
        ) : null}
        <Pressable
          accessibilityHint={selectable ? "Copia el texto completo" : "Toca para copiar"}
          accessibilityLabel={isCopied ? `${copyLabel}. Copiado` : copyLabel}
          accessibilityState={{
            disabled: disabled || status === "copying",
            busy: status === "copying",
          }}
          accessibilityValue={{
            text: isCopied
              ? "Copiado"
              : status === "copying"
                ? "Copiando"
                : status === "error"
                  ? "Error al copiar"
                  : "",
          }}
          disabled={disabled || status === "copying"}
          onPress={() => {
            void handleCopy();
          }}
          style={{
            minHeight: 48,
            minWidth: 48,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: selectable ? "center" : "flex-start",
            gap: 8,
            flexShrink: selectable ? 0 : 1,
          }}
          testID={testID}
        >
          {!selectable ? (
            <Typography.Text className={className} style={{ flexShrink: 1 }} variant="body">
              {displayText}
            </Typography.Text>
          ) : null}
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ width: 24, alignItems: "center" }}
          >
            {status === "copying" ? (
              <ActivityIndicator color={theme.text.accent} size="small" />
            ) : (
              <Icon
                color={isCopied ? theme.success : theme.text.accent}
                name={isCopied ? "check" : status === "error" ? "error" : "copy"}
                size={20}
              />
            )}
          </View>
        </Pressable>
      </View>
      {status === "error" ? (
        <Typography.Text
          accessibilityLiveRegion="polite"
          className="text-danger"
          variant="bodySmall"
        >
          No se pudo copiar. Toca para reintentar.
        </Typography.Text>
      ) : null}
    </View>
  );
}

export default CopyableText;
