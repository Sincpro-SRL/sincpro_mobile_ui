import { CustomIconProps } from "@sincpro/mobile-ui/icons/props";
import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const AddItemIcon: React.FC<CustomIconProps> = ({ size = 25 }) => (
  <Svg fill="none" height={size} viewBox="0 0 25 24" width={size}>
    <G clipPath="url(#clip0_9386_14684)">
      <Path
        d="M8.5 16H5.93C3.64 16 2.5 14.86 2.5 12.57V5.43C2.5 3.14 3.64 2 5.93 2H10.5C12.79 2 13.93 3.14 13.93 5.43"
        stroke="#047DF9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M19.0703 22H14.5003C12.2103 22 11.0703 20.86 11.0703 18.57V11.43C11.0703 9.14 12.2103 8 14.5003 8H19.0703C21.3603 8 22.5003 9.14 22.5003 11.43V18.57C22.5003 20.86 21.3603 22 19.0703 22Z"
        stroke="#047DF9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M15.3701 15H18.6301"
        stroke="#047DF9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M17 16.63V13.37"
        stroke="#047DF9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_9386_14684">
        <Rect fill="white" height="24" transform="translate(0.5)" width="24" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default AddItemIcon;
