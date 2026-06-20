import { Ionicons } from "@expo/vector-icons";
import InputField from "@sincpro/mobile-ui/Form/Form.InputField";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export interface PasswordFieldProps {
  label: string;
  error?: string;
  inputProps: React.ComponentProps<typeof InputField>["inputProps"];
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, error, inputProps }) => {
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
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          className="text-text-primary"
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordField;
