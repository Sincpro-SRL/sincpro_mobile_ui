import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

const ArrangeCircleIcon: React.FC<CustomIconProps> = ({ size = 25 }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M17.1494 13.82L14.1094 16.86"
      stroke="#232933"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M6.84961 13.82H17.1496"
      stroke="#232933"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M6.84961 10.18L9.88962 7.14001"
      stroke="#232933"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M17.1496 10.18H6.84961"
      stroke="#232933"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrangeCircleIcon;
