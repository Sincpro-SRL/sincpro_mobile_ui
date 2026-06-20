import { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import React from "react";
import Svg, { Path } from "react-native-svg";

const CalendarIcon: React.FC<CustomIconProps> = ({ size = 24, color = "#0075FF" }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M8 2V5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M16 2V5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M3.5 9.08997H20.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M15.6947 13.7H15.7037"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <Path
      d="M15.6947 16.7H15.7037"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <Path
      d="M11.9955 13.7H12.0045"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <Path
      d="M11.9955 16.7H12.0045"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <Path
      d="M8.29431 13.7H8.30329"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <Path
      d="M8.29431 16.7H8.30329"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Svg>
);

export default CalendarIcon;
