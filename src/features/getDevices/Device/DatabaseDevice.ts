import { Device } from "./Device";

class DatabaseDevice extends Device {
  constructor({
    id,
    manufacturer,
    model,
    osName,
    displayWidth,
    displayHeight,
    ...rest
  }: {
    id: number;
    manufacturer: string;
    model: string;
    osName: string | null;
    displayWidth: number;
    displayHeight: number;
  }) {
    super({
      id,
      manufacturer,
      model,
      os: osName ?? "Other",
      displayWidth: displayWidth,
      displayHeight: displayHeight,
    });
  }
}

export { DatabaseDevice };
