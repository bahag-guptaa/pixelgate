import express from "express";
import cors from "cors";
import userRouter from "./routes/UserRoutes.js";
import authRouter from "./routes/AuthRoutes.js";
import gameRouter from "./routes/gameRouter.js";
import reviewRouter from "./routes/ReviewRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("Welcome to the PixelGate API!");
  });

  app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/", authRouter);
  app.use("/api", userRouter);
  app.use("/api/games", gameRouter);
  app.use("/api", reviewRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  });

  return app;
};

export default createApp;