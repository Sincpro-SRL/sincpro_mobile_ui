import { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import React from "react";
import Svg, { Path } from "react-native-svg";

const SettingsIcon: React.FC<CustomIconProps> = ({ size = 24, color = "#0075FF" }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <Path
      d="M15.5703 18.5001V14.6001"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M15.5703 7.45V5.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M15.5697 12.65C17.0057 12.65 18.1697 11.4859 18.1697 10.05C18.1697 8.61401 17.0057 7.44995 15.5697 7.44995C14.1338 7.44995 12.9697 8.61401 12.9697 10.05C12.9697 11.4859 14.1338 12.65 15.5697 12.65Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M8.42969 18.5V16.55"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M8.42969 9.4V5.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <Path
      d="M8.43008 16.5501C9.86602 16.5501 11.0301 15.386 11.0301 13.9501C11.0301 12.5142 9.86602 11.3501 8.43008 11.3501C6.99414 11.3501 5.83008 12.5142 5.83008 13.9501C5.83008 15.386 6.99414 16.5501 8.43008 16.5501Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
  </Svg>
);

export default SettingsIcon;
