import dotenv from "dotenv";
import Devices from "./features/getDevices";
import sendToSlack from "./features/sendToSlack";

dotenv.config();

async function execute() {
  await sendToSlack("Starting...");
  const obj = new Devices();
  await sendToSlack("Initializing devices...");
  await obj.init();
  await sendToSlack("Initialized!");
  await sendToSlack("Executing changes...");
  await obj.execute();
  await sendToSlack("Changes executed!");
  process.exit(0);
}
execute();
