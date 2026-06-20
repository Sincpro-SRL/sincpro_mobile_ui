import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

function ArrowDownIcon({ size = 56, color = "#FFFFFF" }: CustomIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 56 56" width={size}>
      <Path
        d="M28.0003 51.3333C40.887 51.3333 51.3337 40.8866 51.3337 28C51.3337 15.1133 40.887 4.66663 28.0003 4.66663C15.1137 4.66663 4.66699 15.1133 4.66699 28C4.66699 40.8866 15.1137 51.3333 28.0003 51.3333Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <Path
        d="M28 19.8334V33.8334"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <Path
        d="M21 29.1666L28 36.1666L35 29.1666"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </Svg>
  );
}
export default ArrowDownIcon;
