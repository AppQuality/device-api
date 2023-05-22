import tryberDb from "@appquality/tryber-database";
import dotenv from "dotenv";

dotenv.config();

export const tryber = tryberDb({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tryber",
  },
  pool: { min: 1, max: 7 },
});
