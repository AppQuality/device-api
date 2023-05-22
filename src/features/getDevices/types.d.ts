interface iDevice {
  id: number;
  manufacturer: string;
  model: string;
  os: string;
  display?: {
    width: number;
    height: number;
  };

  idIsEqual(device: iDevice): boolean;
  dataIsEqual(device: iDevice): boolean;
  isChanged(device: iDevice): boolean;
}

type XmlRow = Array<{
  $: {
    name: string;
    internal_name: string;
    value?: string;
  };
  property?: XmlRow;
}>;
type XmlDevice = {
  id: string[];
  manufacturer: string[];
  model: string[];
  properties: XmlRow;
};

export { iDevice, XmlDevice, XmlRow };
