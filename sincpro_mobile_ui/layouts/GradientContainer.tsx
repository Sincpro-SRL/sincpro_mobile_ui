import { useTheme } from "@sincpro/mobile-ui/theme";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

interface GradientContainerProps {
  children: ReactNode;
  style?: object;
  className?: string;
}

const GradientContainer = ({ children, style, className }: GradientContainerProps) => {
  const theme = useTheme();
  const gradientColors = theme.gradient.primary;

  return (
    <LinearGradient className={className} colors={[...gradientColors]} style={style}>
      {children}
    </LinearGradient>
  );
};

export default GradientContainer;
