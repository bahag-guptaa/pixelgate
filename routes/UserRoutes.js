import { Router } from "express";
import {
  // getAllUsers,
  // createUser,
  // updateUser,
  // getUserById,
  addFavouriteGame,
  removeFavouriteGame,
  getFavouriteGames,
} from "../controllers/UserController.js";
import { checkToken } from "../middlewares/checkToken.js";

const userRouter = Router();

// userRouter.get("/users", getAllUsers);
// userRouter.post("/users", createUser);
userRouter.get("/users/favourites", checkToken, getFavouriteGames);
userRouter.post("/users/add-favourite", checkToken, addFavouriteGame);
userRouter.post("/users/remove-favourite", checkToken, removeFavouriteGame);
// userRouter.get("/users/:id", getUserById);
// userRouter.put("/users/:id", checkToken, updateUser);

export default userRouter;
