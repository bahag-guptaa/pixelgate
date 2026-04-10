import assert from "node:assert/strict";
import { once } from "node:events";
import createApp from "../app.js";

const app = createApp();
const server = app.listen(0, "127.0.0.1");

try {
  await once(server, "listening");
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not resolve smoke test server address.");
  }

  const healthResponse = await fetch(`http://127.0.0.1:${address.port}/healthz`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), { status: "ok" });

  const rootResponse = await fetch(`http://127.0.0.1:${address.port}/`);
  assert.equal(rootResponse.status, 200);
  assert.equal(await rootResponse.text(), "Welcome to the PixelGate API!");

  console.log("Smoke test passed.");
} finally {
  server.close();
}