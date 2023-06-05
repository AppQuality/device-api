import dotenv from "dotenv";
import Devices from "./features/getDevices";

dotenv.config();

async function execute() {
  console.log("Starting...");
  const obj = new Devices();
  console.log("Initializing devices...");
  await obj.init();
  console.log("Initialized!");
  console.log("Executing changes...");
  await obj.execute();
  console.log("Changes executed!");
  process.exit(0);
}
execute();
