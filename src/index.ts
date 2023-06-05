import dotenv from "dotenv";
import Devices from "./features/getDevices";
import sendToSlack from "./features/sendToSlack";

dotenv.config();

async function execute() {
  sendToSlack("Starting...");
  const obj = new Devices();
  sendToSlack("Initializing devices...");
  await obj.init();
  sendToSlack("Initialized!");
  sendToSlack("Executing changes...");
  await obj.execute();
  sendToSlack("Changes executed!");
  process.exit(0);
}
execute();
