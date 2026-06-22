import { View } from "react-native";

export interface SpacerProps {
  size?: number;
  horizontal?: boolean;
  flex?: boolean;
}

function Spacer({ size = 8, horizontal = false, flex = false }: SpacerProps) {
  if (flex) return <View style={{ flex: 1 }} />;
  return <View style={horizontal ? { width: size } : { height: size }} />;
}

export default Spacer;
export { Spacer };
