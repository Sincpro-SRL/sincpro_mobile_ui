import { cn } from "@sincpro/mobile-ui/theme/tw";
import {
  resolveTextFontFamily,
  typographyVariants,
} from "@sincpro/mobile-ui/theme/typography";
import { TextInput, type TextInputProps } from "react-native";

export type SelectableTextProps = Pick<
  TextInputProps,
  "accessibilityLabel" | "testID" | "style" | "allowFontScaling" | "onSelectionChange"
> & {
  value: string;
  variant?: keyof typeof typographyVariants;
  semibold?: boolean;
  className?: string;
};

function SelectableText({
  value,
  variant = "body",
  semibold = false,
  className,
  style,
  ...props
}: SelectableTextProps) {
  return (
    <TextInput
      {...props}
      className={cn("text-text-primary", className)}
      editable={false}
      multiline
      readOnly
      scrollEnabled={false}
      showSoftInputOnFocus={false}
      style={[
        typographyVariants[variant],
        {
          fontFamily: resolveTextFontFamily(variant, false, semibold),
          padding: 0,
          textAlignVertical: "top",
        },
        style,
      ]}
      underlineColorAndroid="transparent"
      value={value}
    />
  );
}

export default SelectableText;
