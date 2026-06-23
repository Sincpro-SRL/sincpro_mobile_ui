import Svg, { Path } from "react-native-svg";

interface OdooIconProps {
  size?: number;
  color?: string;
}

/**
 * @deprecated Brand-coupled (Odoo logo); relocated to the Odoo integration package. Import
 * from `@sincpro/mobile-odoo/ui/components/atoms` instead. Kept here for backwards
 * compatibility and removed in the next major.
 */
function OdooIcon({ size = 100, color = "#ffffff" }: OdooIconProps) {
  return (
    <Svg fill="none" height={size} viewBox="0 0 919 495" width={size}>
      <Path
        d="M695,346a75,75,0,1,1,75-75A75,75,0,0,1,695,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,695,315ZM538,346a75,75,0,1,1,75-75A75,75,0,0,1,538,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,538,315Zm-82-45c0,41.9-33.6,76-75,76s-75-34-75-75.9S336.5,196,381,196c16.4,0,31.6,3.5,44,12.6V165.1c0-8.3,7.3-15.1,15.5-15.1s15.5,6.8,15.5,15.1Zm-75,45a44,44,0,1,0-44-44A44,44,0,0,0,381,315Z"
        fill={color}
      />
      <Path
        d="M224,346a75,75,0,1,1,75-75A75,75,0,0,1,224,346Zm0-31a44,44,0,1,0-44-44A44,44,0,0,0,224,315Z"
        fill={color}
      />
    </Svg>
  );
}

export default OdooIcon;
