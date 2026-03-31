import {sequelize} from "../../config/database.js";
import { Game } from "../../models/Game.js";
import { Review } from "../../models/Review.js";
import User from "../../models/User.js";
import UserFavouriteGame from "../../models/UserFavouriteGame.js";

// Define associations
Game.hasMany(Review, { foreignKey: 'gameId', as: 'reviews' , onDelete: 'CASCADE' });
Review.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.belongsToMany(Game, { through: UserFavouriteGame, as: "favouriteGames" });
Game.belongsToMany(User, { through: UserFavouriteGame, as: "usersFavoured" });

export {sequelize, Game, Review, User};
