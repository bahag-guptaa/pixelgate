import { Router } from "express";
import {
  registerNewUser,
  loginUser,
  getCurrentUser,
} from "../controllers/AuthController.js";
import { checkToken } from "../middlewares/checkToken.js";

const authRouter = Router();

authRouter.post("/register", registerNewUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", checkToken, getCurrentUser);

export default authRouter;
