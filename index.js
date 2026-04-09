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


app.get("/", (req, res) => {
  res.send("Welcome to the PixelGate API!");
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


const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

start();