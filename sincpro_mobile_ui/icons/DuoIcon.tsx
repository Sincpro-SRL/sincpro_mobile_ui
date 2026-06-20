import React from "react";
import Svg, { Path } from "react-native-svg";

import { CustomIconProps } from "./props";

const DuoIcon: React.FC<CustomIconProps> = ({ size = 56, color = "#FFFFFF" }) => (
  <Svg fill="none" height={size} viewBox="0 0 56 56" width={size}>
    <Path
      d="M21.373 25.3633C21.1396 25.34 20.8596 25.34 20.603 25.3633C15.0496 25.1766 10.6396 20.6266 10.6396 15.0266C10.6396 9.30996 15.2596 4.66663 20.9996 4.66663C26.7163 4.66663 31.3596 9.30996 31.3596 15.0266C31.3363 20.6266 26.9263 25.1766 21.373 25.3633Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <Path
      d="M38.2897 9.33337C42.8163 9.33337 46.4563 12.9967 46.4563 17.5C46.4563 21.91 42.9563 25.5034 38.593 25.6667C38.4063 25.6434 38.1963 25.6434 37.9863 25.6667"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <Path
      d="M9.70668 33.9734C4.06001 37.7534 4.06001 43.9134 9.70668 47.67C16.1233 51.9634 26.6467 51.9634 33.0633 47.67C38.71 43.89 38.71 37.73 33.0633 33.9734C26.67 29.7034 16.1467 29.7034 9.70668 33.9734Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <Path
      d="M42.793 46.6666C44.473 46.3166 46.0596 45.64 47.3663 44.6366C51.0063 41.9066 51.0063 37.4033 47.3663 34.6733C46.083 33.6933 44.5196 33.04 42.863 32.6666"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
  </Svg>
);

export default DuoIcon;
