import { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import React from "react";
import Svg, { Path } from "react-native-svg";

const BoxIcon: React.FC<CustomIconProps> = ({ size = 56, color = "#ffffff" }) => (
  <Svg fill="none" height={size} viewBox="0 0 56 56" width={size}>
    <Path
      d="M7.39648 17.36L27.9998 29.2833L48.4632 17.43"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <Path
      d="M28 50.4233V29.26"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <Path
      d="M23.1705 5.78663L10.7105 12.6933C7.88715 14.2566 5.57715 18.1766 5.57715 21.3966V34.58C5.57715 37.8 7.88715 41.72 10.7105 43.2833L23.1705 50.2133C25.8305 51.6833 30.1938 51.6833 32.8538 50.2133L45.3138 43.2833C48.1371 41.72 50.4472 37.8 50.4472 34.58V21.3966C50.4472 18.1766 48.1371 14.2566 45.3138 12.6933L32.8538 5.7633C30.1705 4.2933 25.8305 4.2933 23.1705 5.78663Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
  </Svg>
);

export default BoxIcon;
