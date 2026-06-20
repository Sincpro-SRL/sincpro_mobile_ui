import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

const CardIcon: React.FC<CustomIconProps> = ({ size = 56, color = "#FFFFFF" }) => (
  <Svg fill="none" height={size} viewBox="0 0 56 56" width={size}>
    <Path
      d="M4.66699 19.8448H51.3337"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
    <Path
      d="M14 38.5116H18.6667"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
    <Path
      d="M24.5 38.5116H33.8333"
      stroke={color}
      stroke-width="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
    <Path
      d="M15.027 8.17822H40.9503C49.257 8.17822 51.3337 10.2316 51.3337 18.4216V37.5782C51.3337 45.7682 49.257 47.8216 40.9737 47.8216H15.027C6.74366 47.8449 4.66699 45.7916 4.66699 37.6016V18.4216C4.66699 10.2316 6.74366 8.17822 15.027 8.17822Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="3"
    />
  </Svg>
);

export default CardIcon;
