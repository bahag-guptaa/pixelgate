import { Sequelize } from "sequelize";
import config from "./config.js";

const env = process.env.NODE_ENV || "development";
const { username, password, database, ...rest } = config[env];

export const sequelize = new Sequelize(database, username, password, rest);