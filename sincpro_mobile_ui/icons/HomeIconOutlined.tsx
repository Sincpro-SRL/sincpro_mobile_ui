import { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import React from "react";
import Svg, { Path } from "react-native-svg";
const HomeIconOutlined: React.FC<CustomIconProps> = ({ size = 24, color = "#374151" }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <Path
      d="M12 17.99V14.99"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Svg>
);

export default HomeIconOutlined;
