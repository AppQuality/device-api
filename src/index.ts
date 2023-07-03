import dotenv from "dotenv";
import Devices from "./features/getDevices";
import sendToSlack from "./features/sendToSlack";

dotenv.config();

async function execute() {
  await sendToSlack("Starting...");
  const obj = new Devices();
  await sendToSlack("Initializing devices...");
  try {
    await obj.init();
  } catch (e) {
    await sendToSlack("Error initializing devices");
    throw e;
  }
  await sendToSlack("Initialized!");
  await sendToSlack("Executing changes...");
  try {
    await obj.execute();
  } catch (e) {
    await sendToSlack("Error executing changes");
    throw e;
  }
  await sendToSlack("Changes executed!");
  process.exit(0);
}
execute();
