import "dotenv/config";
import { Op } from "sequelize";
import { Game } from "../models/Game.js";

const EXPLORE_ATTRIBUTES = ['id', 'name', 'released', 'background_image', 'rating', 'metacritic', 'platforms', 'genres', 'stores', 'esrb_rating', 'game_images'];

const UPSERT_LIST_FIELDS = ['name', 'released', 'background_image', 'rating', 'metacritic', 'platforms', 'genres', 'stores', 'esrb_rating', 'game_images'];

const mapGameFromList = (game) => ({
    id: game.id,
    name: game.name,
    released: game.released,
    background_image: game.background_image,
    rating: game.rating,
    metacritic: game.metacritic,
    platforms: game.platforms?.map(p => p.platform.name),
    genres: game.genres?.map(g => g.name),
    stores: game.stores?.map(s => s.store.name),
    esrb_rating: game.esrb_rating?.name,
    game_images: game.short_screenshots?.map(s => s.image),
});

const saveGamesToDatabase = async (games) => {
    await Game.bulkCreate(games, {
        updateOnDuplicate: UPSERT_LIST_FIELDS
    });
};

const fetchGamesFromExternal = async () => {
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
    const response = await fetch(`${EXTERNAL_API_URL}/games?key=${process.env.RAWG_API_KEY}&page_size=40`);
    if (!response.ok) {
        throw new Error(`External API error: ${response.statusText}`);
    }
    const data = await response.json();
    const games = data.results.map(mapGameFromList);
    await saveGamesToDatabase(games);
    return games;
};

const VALID_ORDER_FIELDS = ['name', 'released', 'rating', 'metacritic'];


export const fetchExplorePageGames = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = (page - 1) * limit;

        const count = await Game.count();
        if (count < 20) {
            await fetchGamesFromExternal();
        }

        const where = {};
        if (req.query.genres) {
            where.genres = { [Op.contains]: req.query.genres.split(',').map(g => g.trim()) };
        }
        if (req.query.platforms) {
            where.platforms = { [Op.contains]: req.query.platforms.split(',').map(p => p.trim()) };
        }

        let order = [['id', 'ASC']];
        if (req.query.ordering) {
            const raw = req.query.ordering;
            const dir = raw.startsWith('-') ? 'DESC' : 'ASC';
            const field = raw.replace(/^-/, '');
            if (VALID_ORDER_FIELDS.includes(field)) {
                order = [[field, dir]];
            }
        }

        const games = await Game.findAll({
            attributes: EXPLORE_ATTRIBUTES,
            where,
            order,
            limit,
            offset,
        });
        res.json({ page, limit, total: count, results: games });
    } catch (error) {
        console.error("Error fetching explore page games:", error);
        res.status(500).json({ error: "An error occurred while fetching games." });
    }
};

const fetchGameScreenshotsFromExternal = async (gameId) => {
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
    try {
        const response = await fetch(`${EXTERNAL_API_URL}/games/${gameId}/screenshots?key=${process.env.RAWG_API_KEY}`);
        const data = await response.json();
        return data.results?.filter(s => !s.hidden).map(s => s.image) || [];
    } catch (error) {
        console.error(`Error fetching screenshots for game ID ${gameId}:`, error);
        return [];
    }
};

const fetchGameClipsFromExternal = async (gameId) => {
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
    try {
    const response = await fetch(`${EXTERNAL_API_URL}/games/${gameId}/movies?key=${process.env.RAWG_API_KEY}`);
    const clipsData = await response.json();
    return clipsData.results?.map(clip => clip.data?.max) || [];
    } catch (error) {
        console.error(`Error fetching game clips for game ID ${gameId}:`, error);
        return [];
    }
}

const fetchGameDetailsFromExternal = async (gameId) => {
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
    const response = await fetch(`${EXTERNAL_API_URL}/games/${gameId}?key=${process.env.RAWG_API_KEY}`);
    if (!response.ok) {
        throw new Error(`External API error: ${response.statusText}`);
    }
    const data = await response.json();
    const [game_images, game_clips] = await Promise.all([
        fetchGameScreenshotsFromExternal(gameId),
        fetchGameClipsFromExternal(gameId),
    ]);
    return {
        // list fields
        id: data.id,
        name: data.name,
        released: data.released,
        background_image: data.background_image,
        rating: data.rating,
        metacritic: data.metacritic,
        platforms: data.platforms?.map(p => p.platform.name),
        genres: data.genres?.map(g => g.name),
        stores: data.stores?.map(s => s.store.name),
        esrb_rating: data.esrb_rating?.name,
        game_images,
        // detail fields
        description: data.description_raw,
        website: data.website,
        developers: data.developers?.map(d => d.name),
        details_fetched: true,
        game_clips,
    };
};

export const searchGames = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Search query is required. Use ?q=" });
        }

        const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
        const response = await fetch(
            `${EXTERNAL_API_URL}/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=20`
        );
        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }
        const data = await response.json();

        await saveGamesToDatabase(data.results.map(mapGameFromList));

        const results = data.results.map(game => ({
            id: game.id,
            name: game.name,
            background_image: game.background_image,
        }));

        res.json({ count: data.count, results });
    } catch (error) {
        console.error("Error searching games:", error);
        res.status(500).json({ error: "An error occurred while searching games." });
    }
};

export const fetchGameDetailsPage = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            return res.status(400).json({ error: "Invalid game ID." });
        }

        let game = await Game.findByPk(gameId);

        if (!game || !game.details_fetched) {
            const details = await fetchGameDetailsFromExternal(gameId);
            if (!game) {
                game = await Game.create(details);
            } else {
                await game.update(details);
            }
        }

        res.json(game);
    } catch (error) {
        console.error("Error fetching game details:", error);
        res.status(500).json({ error: "An error occurred while fetching game details." });
    }
};