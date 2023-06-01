import dotenv from "dotenv";
import Devices from "./features/getDevices";

dotenv.config();

async function execute() {
  const obj = new Devices();
  await obj.init();
  await obj.execute();
}
execute();
