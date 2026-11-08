import { Display } from "@sincpro/mobile-ui/Display";
import type { KeyboardFormProps } from "@sincpro/mobile-ui/Form/Form.KeyboardForm";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import type { SafeAreaEdge } from "@sincpro/mobile-ui/layouts/edges";
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
  edges?: SafeAreaEdge[];
  keyboardFormProps?: Omit<KeyboardFormProps, "children">;
}

function AuthFormView({
  title,
  description,
  logoSource,
  onBack,
  FormNode,
  background,
  edges,
  keyboardFormProps,
}: AuthFormProps) {
  const renderTitle = () => {
    if (!title) return null;
    return (
      <Text bold variant="h3">
        {title}
      </Text>
    );
  };

  const renderDescription = () => {
    if (!description) return null;
    return (
      <Text className="mt-1 text-text-secondary" variant="body">
        {description}
      </Text>
    );
  };

  return (
    <AuthContainer
      background={background}
      edges={edges}
      header={<Logo size="large" source={logoSource} />}
      keyboardFormProps={keyboardFormProps}
      onBackPress={onBack}
    >
      <View>
        <View className="mb-6">
          {renderTitle()}
          {renderDescription()}
        </View>
        {FormNode}
      </View>
    </AuthContainer>
  );
}

export default AuthFormView;
