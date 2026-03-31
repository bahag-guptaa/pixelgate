import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  getUserById,
  addFavouriteGame,
  removeFavouriteGame,
} from "../controllers/UserController.js";
import { checkToken } from "../middlewares/checkToken.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.post("/users", createUser);
userRouter.post("/users/add-favourite", checkToken, addFavouriteGame);
userRouter.post("/users/remove-favourite", checkToken, removeFavouriteGame);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUser);

export default userRouter;
