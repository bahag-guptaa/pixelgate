import express from "express";
import cors from "cors";
import { sequelize } from "./utils/database/relation.js";
import "dotenv/config";
import userRouter from "./routes/UserRoutes.js";
import authRouter from "./routes/AuthRoutes.js";
import gameRouter from "./routes/gameRouter.js";
import reviewRouter from "./routes/ReviewRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.get("/", (req, res) => {
  res.send("Welcome to the PixelGate API!");
});

app.use("/", authRouter);
app.use("/api", userRouter);
app.use("/api/games", gameRouter);
app.use("/api", reviewRouter);

app.listen(PORT, HOST, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
