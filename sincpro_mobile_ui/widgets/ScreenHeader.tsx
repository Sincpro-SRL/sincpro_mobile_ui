import { View } from "react-native";

import GradientContainer from "../layouts/GradientContainer";
import { Navigation } from "../Navigation";

const Header = Navigation.Header;
const HeaderToolbar = Navigation.HeaderToolbar;

export const enum EVariantScreenHeader {
  FLAT_HEADER = "FLAT_HEADER",
  ROUNDED_HEADER = "ROUNDED_HEADER",
  LOGO_WITH_BACK_BUTTON = "LOGO_WITH_BACK_BUTTON",
  ONLY_LOGO = "ONLY_LOGO",
}

interface ScreenHeaderProps {
  variant?: EVariantScreenHeader;
  title?: string;
  centerTitle?: boolean;
  subtitle?: string;
  logo?: boolean;
  rightComponent?: React.ReactNode;
  children?: React.ReactNode;
  withGradientContainer?: boolean;
  onBack?: () => void;
}

function ScreenHeader({
  variant,
  title = "Distribución",
  subtitle,
  onBack,
  children,
}: ScreenHeaderProps) {
  switch (variant) {
    case EVariantScreenHeader.FLAT_HEADER:
      return (
        <>
          <HeaderToolbar
            flat={true}
            onBack={onBack}
            subtitle={subtitle}
            title={title}
            withBackground={true}
          />
          <View>{children}</View>
        </>
      );
    case EVariantScreenHeader.ROUNDED_HEADER:
      return (
        <GradientContainer className="pt-0.5 shadow-lg shadow-black/70 rounded-b-[18px] pb-6">
          <HeaderToolbar
            flat={true}
            onBack={onBack}
            subtitle={subtitle}
            title={title}
            withBackground={false}
          >
            {children}
          </HeaderToolbar>
        </GradientContainer>
      );
    case EVariantScreenHeader.LOGO_WITH_BACK_BUTTON:
      return <Header backButton handleBackButton={onBack} title={"Distribución"} />;
    case EVariantScreenHeader.ONLY_LOGO:
      return <Header title={title} />;
    default:
      return null;
  }
}

export default ScreenHeader;
