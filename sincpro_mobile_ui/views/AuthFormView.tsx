import { Display } from "@sincpro/mobile-ui/Display";
import AuthContainer from "@sincpro/mobile-ui/layouts/AuthContainer";
import type { AppBarBackground } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { ReactNode } from "react";
import { type ImageSourcePropType, View } from "react-native";

const Logo = Display.Logo;
const Text = Typography.Text;

interface AuthFormProps {
  title?: string;
  description?: string;
  logoSource?: ImageSourcePropType;
  onBack?: () => void;
  FormNode: ReactNode;
  background?: AppBarBackground;
}

function AuthFormView({
  title,
  description,
  logoSource,
  onBack,
  FormNode,
  background,
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
      header={<Logo size="large" source={logoSource} />}
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
