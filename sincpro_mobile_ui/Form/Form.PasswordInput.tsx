import { Display } from "@sincpro/mobile-ui/Display";
import InputField from "@sincpro/mobile-ui/Form/Form.InputField";
import { useTheme } from "@sincpro/mobile-ui/theme";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export interface PasswordFieldProps {
  label: string;
  error?: string;
  inputProps: React.ComponentProps<typeof InputField>["inputProps"];
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, error, inputProps }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4 relative">
      <InputField
        error={error}
        inputProps={{
          ...inputProps,
          secureTextEntry: !showPassword,
          autoComplete: "off",
          importantForAutofill: "no",
        }}
        label={label}
      />
      <TouchableOpacity
        className="absolute right-3 bottom-[25px]"
        hitSlop={8}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Display.Icon
          color={theme.icon.secondary}
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={22}
          type="ionicons"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordField;
