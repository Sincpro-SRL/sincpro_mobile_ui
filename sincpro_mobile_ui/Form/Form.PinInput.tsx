import Pressable from "@sincpro/mobile-ui/primitives/Pressable";
import { theme } from "@sincpro/mobile-ui/theme";
import { cn } from "@sincpro/mobile-ui/theme/tw";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { useRef } from "react";
import { TextInput, View } from "react-native";

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  secure?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
  testID?: string;
}

function PinInput({
  value,
  onChange,
  length = 6,
  secure = false,
  autoFocus = false,
  onComplete,
  className,
  testID,
}: PinInputProps) {
  const inputRef = useRef<TextInput>(null);
  const chars = value.split("");

  const handleChange = (text: string) => {
    const next = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <Pressable
      accessibilityLabel="Código de verificación"
      className={cn("flex-row gap-2", className)}
      onPress={() => inputRef.current?.focus()}
      testID={testID}
    >
      {Array.from({ length }).map((_, index) => {
        const filled = index < value.length;
        const active = index === value.length;
        return (
          <View
            className="flex-1 aspect-square max-w-[52px] rounded-lg border bg-bg-card items-center justify-center"
            key={index}
            style={{ borderColor: active ? theme.border.focus : theme.border.default }}
          >
            <Typography.Text className="text-text-primary" variant="h4">
              {filled ? (secure ? "•" : chars[index]) : ""}
            </Typography.Text>
          </View>
        );
      })}
      <TextInput
        autoFocus={autoFocus}
        caretHidden
        keyboardType="number-pad"
        maxLength={length}
        onChangeText={handleChange}
        ref={inputRef}
        style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
        textContentType="oneTimeCode"
        value={value}
      />
    </Pressable>
  );
}

export default PinInput;
