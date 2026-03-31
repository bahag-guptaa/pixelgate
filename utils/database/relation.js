import User from "../../models/User.js";
import { Game } from "../../models/Game.js";
import UserFavouriteGame from "../../models/UserFavouriteGame.js";

User.belongsToMany(Game, { through: UserFavouriteGame, as: "favouriteGames" });
Game.belongsToMany(User, { through: UserFavouriteGame, as: "usersFavoured" });
