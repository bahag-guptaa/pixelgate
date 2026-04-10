import { fileURLToPath } from "node:url";
import { sequelize } from "./utils/database/relation.js";
import "dotenv/config";
import createApp from "./app.js";

const DEFAULT_PORT = 3000;

const resolvePort = () => {
  const parsedPort = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
  return Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;
};

export const app = createApp();

export const startServer = async () => {
  await sequelize.authenticate();
  console.log("DB connected");

  if (process.env.DB_SYNC_ON_START === "true") {
    await sequelize.sync();
    console.log("DB schema synchronized");
  }

  const port = resolvePort();

  return app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on ${port}`);
  });
};

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  startServer().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
}