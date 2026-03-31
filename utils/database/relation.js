import {sequelize} from "../../config/database.js";
import { Game } from "../../models/Game.js";
import { Review } from "../../models/Review.js";
import User from "../../models/User.js";

// Define associations
Game.hasMany(Review, { foreignKey: 'gameId', as: 'reviews' , onDelete: 'CASCADE' });
Review.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {sequelize, Game, Review, User};