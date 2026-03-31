import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Game = sequelize.define("Game", {
    // --- list endpoint fields (populated during seed) ---
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    released: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    background_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    metacritic: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    platforms: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Storing as array of platform names
        allowNull: true,
    },
    genres: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Storing as array of genre names
        allowNull: true,
    },
    stores: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // Storing as array of "storeName|storeDomain"
        allowNull: true,
    },
    esrb_rating: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    game_images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
    },
    // --- detail endpoint fields (null until user visits the game page) ---
    details_fetched: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    developers: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    game_clips: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
    },
});