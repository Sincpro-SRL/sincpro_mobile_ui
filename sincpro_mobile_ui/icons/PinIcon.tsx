import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

const PinIcon: React.FC<CustomIconProps> = ({ size = 24, color = "#0075FF" }) => (
  <Svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <Path
      d="M20.6228 8.45C19.5728 3.83 15.5428 1.75 12.0028 1.75C12.0028 1.75 12.0028 1.75 11.9928 1.75C8.4628 1.75 4.4228 3.82 3.3728 8.44C2.2028 13.6 5.14281 17.97 8.00281 20.72C8.00281 20.72 10.9828 23.5 11.9928 23.5C13.0028 23.5 16.0028 20.72 16.0028 20.72C19.0028 17.5 21.7928 13.61 20.6228 8.45ZM12.0028 13.46C10.2628 13.46 8.8528 12.05 8.8528 10.31C8.8528 8.57 10.2628 7.16 12.0028 7.16C13.7428 7.16 15.1528 8.57 15.1528 10.31C15.1528 12.05 13.7428 13.46 12.0028 13.46Z"
      fill={color}
    />
  </Svg>
);

export default PinIcon;
