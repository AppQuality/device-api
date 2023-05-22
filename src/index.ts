import express from "express";
import Devices from "./features/getDevices";

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  const obj = new Devices();
  await obj.init();
  const devices = await obj.getDevices();
  res.send(devices);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
