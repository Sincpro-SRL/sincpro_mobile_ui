import { ReactNode } from "react";
import { View } from "react-native";

import { Display } from "../Display";
import AuthContainer from "../layouts/AuthContainer";
import { Typography } from "../Typography";

const Logo = Display.Logo;
const Text = Typography.Text;

interface AuthFormProps {
  title?: string;
  description?: string;
  onBack?: () => void;
  FormNode: ReactNode;
}

function AuthFormView({ title, description, onBack, FormNode }: AuthFormProps) {
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
    <AuthContainer header={<Logo size="large" />} onBackPress={onBack}>
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
