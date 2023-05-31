import { XmlDevice, XmlRow } from "../types";
import { Device } from "./Device";

class PhoneArenaDevice extends Device {
  constructor(device: XmlDevice, validOs: string[]) {
    const { os, display } = PhoneArenaDevice.extractProperties(device);

    super({
      id: Number(device.id[0]),
      manufacturer: device.manufacturer[0],
      model: device.model[0],
      os: validOs.includes(os) ? os : "Other",
      displayWidth: display.width || 0,
      displayHeight: display.height || 0,
    });
  }

  private static extractProperties(device: XmlDevice) {
    const connectivityFeatures = PhoneArenaDevice.extractConnectivity(device);
    const designFeatures = PhoneArenaDevice.extractDesign(device);
    const os = PhoneArenaDevice.extractOs(device);
    const display = PhoneArenaDevice.extractDisplaySize(device);
    return { os, display };
  }

  private static findPropertyByName(rows: XmlRow, name: string) {
    return rows.find((property) => property.$.internal_name === name);
  }

  private static extractConnectivity(device: XmlDevice): string[] {
    const areas = device.properties[0].property;

    const connectivity = PhoneArenaDevice.findPropertyByName(
      areas,
      "Connectivity & Features"
    );
    if (!connectivity) return [];
    const other = PhoneArenaDevice.findPropertyByName(
      connectivity.property,
      "Connectivity_Other"
    );
    if (!other) return [];

    return other.$.value.split(",").filter((feature) => feature.length > 0);
  }

  private static extractDesign(device: XmlDevice): string[] {
    const areas = device.properties[0].property;
    const design = PhoneArenaDevice.findPropertyByName(areas, "Design");
    if (!design) return [];
    const features = PhoneArenaDevice.findPropertyByName(
      design.property,
      "Biometrics"
    );
    if (!features) return [];

    return features.$.value.split(",").filter((feature) => feature.length > 0);
  }
  private static extractOs(device: XmlDevice) {
    const areas = device.properties[0].property;
    const hardware = PhoneArenaDevice.findPropertyByName(
      areas,
      "Hardware & Performance"
    );
    if (!hardware) return "Other";
    const os = PhoneArenaDevice.findPropertyByName(
      hardware.property,
      "Smart_Phone"
    );

    if (!os) return "Other";

    const osValue = PhoneArenaDevice.findPropertyByName(os.property, "OS");

    if (!osValue || osValue.$.value === "") return "Other";

    return osValue.$.value;
  }

  private static extractDisplaySize(device: XmlDevice) {
    const areas = device.properties[0].property;
    const display = PhoneArenaDevice.findPropertyByName(areas, "Display");
    if (!display) return;
    const resolution = PhoneArenaDevice.findPropertyByName(
      display.property,
      "Main_Display"
    );

    const size = PhoneArenaDevice.findPropertyByName(
      resolution.property,
      "Display_Size"
    );
    const width = PhoneArenaDevice.findPropertyByName(
      size.property,
      "Display_Width"
    );
    const height = PhoneArenaDevice.findPropertyByName(
      size.property,
      "Display_Height"
    );

    if (!width || !height) return;
    return {
      width: Number(width.$.value),
      height: Number(height.$.value),
    };
  }
}

export { PhoneArenaDevice };
