import { tryber } from "../database";
import phoneArenaAPI from "../phonearenaApi";
import { DatabaseDevice } from "./Device/DatabaseDevice";
import { PhoneArenaDevice } from "./Device/PhoneArenaDevice";
import { iDevice } from "./types";

class Devices {
  private ready: Promise<boolean>;
  private databaseDevices: iDevice[];
  private phoneArenaDevices: iDevice[];

  private os: Record<string, number> = {};

  get newDevices() {
    return this.phoneArenaDevices.filter(
      (phoneArenaDevice) =>
        !this.databaseDevices.find((databaseDevice) =>
          databaseDevice.idIsEqual(phoneArenaDevice)
        )
    );
  }

  get changedDevices() {
    return this.phoneArenaDevices.filter((device) =>
      this.databaseDevices.find((databaseDevice) =>
        databaseDevice.isChanged(device)
      )
    );
  }

  public async init() {
    this.os = await this.getOs();
    this.databaseDevices = await this.getCurrentDevices();
    this.phoneArenaDevices = await this.getDevicesFromXml();
    this.ready = Promise.resolve(true);
    return true;
  }

  private async getOs() {
    const os = await tryber.tables.WpAppqEvdPlatform.do().select("id", "name");
    return os.reduce((acc, os) => {
      acc[os.name] = os.id;
      return acc;
    }, {});
  }

  private async getCurrentDevices() {
    return (
      await tryber.tables.WpDcAppqDevices.do()
        .select(
          tryber.ref("source_id").as("id"),
          "manufacturer",
          "model",
          tryber.ref("name").withSchema("wp_appq_evd_platform").as("osName"),
          tryber
            .ref("display_width")
            .withSchema("wp_dc_appq_devices")
            .as("displayWidth"),
          tryber
            .ref("display_height")
            .withSchema("wp_dc_appq_devices")
            .as("displayHeight")
        )
        .leftJoin(
          "wp_appq_evd_platform",
          "wp_appq_evd_platform.id",
          "wp_dc_appq_devices.platform_id"
        )
    ).map((device) => new DatabaseDevice(device));
  }

  private async getDevicesFromXml(page: number = 1): Promise<any[]> {
    const list = await phoneArenaAPI();
    const validOsNames = Object.keys(this.os);
    return list.map((device) => new PhoneArenaDevice(device, validOsNames));
  }

  public async getDevices() {
    if (!(await this.ready)) {
      throw new Error("Call init() first");
    }

    return {
      new: this.newDevices,
      changed: this.changedDevices,
    };
  }

  public async getQueries() {
    const { new: newDevices, changed: changedDevices } =
      await this.getDevices();

    const newDevicesQueries = newDevices.map((device) => {
      const osId = device.os in this.os ? this.os[device.os] : 0;
      return tryber.tables.WpDcAppqDevices.do()
        .insert({
          source_id: device.id,
          manufacturer: device.manufacturer,
          model: device.model,
          device_type: 0,
          platform_id: osId,
          display_width: device.display.width,
          display_height: device.display.height,
        })
        .toQuery();
    });
    const changedDevicesQueries = changedDevices.map((device) => {
      const osId = device.os in this.os ? this.os[device.os] : 0;
      return tryber.tables.WpDcAppqDevices.do()
        .update({
          manufacturer: device.manufacturer,
          model: device.model,
          platform_id: osId,
          display_width: device.display.width,
          display_height: device.display.height,
        })
        .where({
          source_id: device.id,
        })
        .toQuery();
    });

    return [...newDevicesQueries, ...changedDevicesQueries];
  }
}

export default Devices;
