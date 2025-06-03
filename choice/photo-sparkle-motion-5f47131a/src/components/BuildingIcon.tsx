
import { Building } from "lucide-react";

interface BuildingIconProps {
  size?: number;
}

const BuildingIcon = ({ size = 24 }: BuildingIconProps) => {
  return <Building size={size} />;
};

export default BuildingIcon;
