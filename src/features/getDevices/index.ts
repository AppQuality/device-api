import fs from "fs";

import xml2js from "xml2js";
import { tryber } from "../database";
import { DatabaseDevice } from "./Device/DatabaseDevice";
import { PhoneArenaDevice } from "./Device/PhoneArenaDevice";
import { iDevice, XmlDevice } from "./types";

class Devices {
  private ready: Promise<boolean>;
  private databaseDevices: iDevice[];
  private phoneArenaDevices: iDevice[];

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
    this.databaseDevices = await this.getCurrentDevices();
    this.phoneArenaDevices = await this.getDevicesFromXml();
    this.ready = Promise.resolve(true);
    return true;
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
    const xml = fs.readFileSync("./phonearena.xml", "utf8");
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        if (err) {
          return reject(err);
        }

        const list: XmlDevice[] = result.phones.phone;
        return resolve(list.map((device) => new PhoneArenaDevice(device)));
      });
    });
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
}

export default Devices;
