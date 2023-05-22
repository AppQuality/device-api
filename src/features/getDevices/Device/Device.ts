import { iDevice } from "../types";

class Device implements iDevice {
  public id: number;
  public manufacturer: string;
  public model: string;
  public os: string;
  public display: {
    width: number;
    height: number;
  };

  constructor({
    id,
    manufacturer,
    model,
    os,
    displayWidth,
    displayHeight,
  }: {
    id: number;
    manufacturer: string;
    model: string;
    os: string;
    displayWidth?: number;
    displayHeight?: number;
  }) {
    this.id = id;
    this.manufacturer = manufacturer;
    this.model = model;
    this.os = os;
    this.display = {
      width: displayWidth || 0,
      height: displayHeight || 0,
    };
  }

  public idIsEqual(device: iDevice) {
    return this.id === device.id;
  }

  public dataIsEqual(device: iDevice) {
    return (
      this.manufacturer === device.manufacturer &&
      this.model === device.model &&
      this.os === device.os &&
      this.display.width === device.display.width &&
      this.display.height === device.display.height
    );
  }

  public isChanged(device: iDevice) {
    return this.idIsEqual(device) && !this.dataIsEqual(device);
  }

  toJSON() {
    return {
      id: this.id,
      manufacturer: this.manufacturer,
      model: this.model,
      os: this.os,
      display:
        this.display.width === 0 || this.display.height === 0
          ? undefined
          : this.display,
    };
  }
}

export { Device };
