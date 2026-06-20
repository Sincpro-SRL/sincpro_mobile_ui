import Svg, { Path } from "react-native-svg";

interface CreditIconProps {
  width?: number;
  height?: number;
  color?: string;
}

function CreditIcon({ width = 24, height = 24, color = "#000000" }: CreditIconProps) {
  return (
    <Svg fill="none" height={height} viewBox="0 0 24 24" width={width}>
      <Path
        d="M21 5H3C2.44772 5 2 5.44772 2 6V18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18V6C22 5.44772 21.5523 5 21 5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Path
        d="M2 9H22"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Path
        d="M6 15H8"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Path
        d="M10 15H14"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  );
}

export default CreditIcon;
