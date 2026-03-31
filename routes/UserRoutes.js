import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
} from "../controllers/UserController.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.post("/users", createUser);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUser);

export default userRouter;
