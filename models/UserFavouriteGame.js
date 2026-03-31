import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./User.js";
import { Game } from "./Game.js";

const UserFavouriteGame = sequelize.define("UserFavouriteGame", {
  GameId: {
    type: DataTypes.INTEGER,
    references: {
      model: Game,
      key: "id",
    },
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});

export default UserFavouriteGame;
