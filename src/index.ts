import dotenv from "dotenv";
import express from "express";
import Devices from "./features/getDevices";
import apikey from "./middleware/apikey";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", apikey, async (req, res) => {
  const obj = new Devices();
  await obj.init();
  const devices = await obj.getDevices();
  res.send(devices);
});

app.get("/queries", apikey, async (req, res) => {
  const obj = new Devices();
  await obj.init();
  const devices = await obj.getQueries();
  res.send(devices.join(";\n"));
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
