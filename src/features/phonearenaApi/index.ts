import axios from "axios";
import dotenv from "dotenv";
import util from "util";
import xml2js from "xml2js";
import { XmlDevice } from "../getDevices/types";

const xmlParse = util.promisify(xml2js.parseString);
dotenv.config();

const instance = process.env.TUNNEL
  ? axios.create({
      baseURL: "https://localhost:8081/",
      headers: {
        get: {
          Host: "www.phonearena.com",
        },
      },
    })
  : axios.create({
      baseURL: "https://www.phonearena.com/",
    });

class PhoneArena {
  private total = 0;
  private perPage = 100;

  constructor() {}

  async init() {
    const response = await instance.get(
      `/api.php?key=${process.env.PHONEARENA_KEY}&limit=1`
    );
    const result = (await xmlParse(response.data)) as {
      phones: { count: string[] };
    };
    this.total = Number(result.phones.count[0]);
  }

  private async getFromPage(page: number) {
    const response = await instance.get(
      `/api.php?key=${process.env.PHONEARENA_KEY}&limit=${this.perPage}&start=${
        page * this.perPage
      }`
    );
    const result = (await xmlParse(response.data)) as {
      phones: { phone: XmlDevice[] };
    };
    return result.phones.phone;
  }

  async get() {
    const pages = Math.ceil(this.total / this.perPage);
    const promises = Array.from({ length: pages }, (_, i) =>
      this.getFromPage(i)
    );
    const results = await Promise.all(promises);
    return results.reduce((acc, val) => [...acc, ...val], []);
  }
}

const phoneArenaAPI = async () => {
  const pa = new PhoneArena();
  await pa.init();
  return await pa.get();
};

export default phoneArenaAPI;
