import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

const ToggleOffIcon: React.FC<CustomIconProps> = ({ size = 24, color = "#374151" }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M10 4H14C18.42 4 22 7.58 22 12C22 16.42 18.42 20 14 20H10C5.58 20 2 16.42 2 12C2 7.58 5.58 4 10 4Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <Path
      d="M10 16C12.2091 16 14 14.2091 14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12C6 14.2091 7.79086 16 10 16Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Svg>
);

export default ToggleOffIcon;
