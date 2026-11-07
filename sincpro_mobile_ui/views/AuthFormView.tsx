import { Display } from "@sincpro/mobile-ui/Display";
import type { KeyboardFormProps } from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { Typography } from "@sincpro/mobile-ui/Typography";
import type { ImageSource } from "@sincpro/mobile-ui/utils/image";
import { ReactNode } from "react";
import { View } from "react-native";

const Logo = Display.Logo;
const Text = Typography.Text;

interface AuthFormProps {
  title?: string;
  description?: string;
  logoSource?: ImageSource;
  onBack?: () => void;
  FormNode: ReactNode;
  background?: AppBarBackground;
  barStyle?: "light-content" | "dark-content";
  keyboardToolbar?: boolean;
  keyboardFormProps?: Omit<KeyboardFormProps, "children" | "toolbar">;
}

function AuthFormView({
  title,
  description,
  logoSource,
  onBack,
  FormNode,
  background,
  barStyle,
  keyboardToolbar,
  keyboardFormProps,
}: AuthFormProps) {
  const renderTitle = () => {
    if (!title) return null;
    return (
      <Text semibold variant="h4">
        {title}
      </Text>
    );
  };

  const renderDescription = () => {
    if (!description) return null;
    return <Text variant="body">{description}</Text>;
  };

  return (
    <AuthContainer
      background={background}
      barStyle={barStyle}
      header={<Logo size="large" source={logoSource} />}
      keyboardFormProps={keyboardFormProps}
      keyboardToolbar={keyboardToolbar}
      onBackPress={onBack}
    >
      <View className="m-4">
        <View className="mb-5">
          {renderTitle()}
          {renderDescription()}
        </View>
        {FormNode}
      </View>
    </AuthContainer>
  );
}

export default AuthFormView;
