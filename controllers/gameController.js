import "dotenv/config";
import { Op } from "sequelize";
import { Game } from "../models/Game.js";
import { Review } from "../models/Review.js";
import User from "../models/User.js";

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
        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }
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
        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }
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

export const fetchFilterOptions = async (req, res) => {
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";
    const key = process.env.RAWG_API_KEY;

    try {
        const [platformsRes, genresRes, storesRes, developerRes] = await Promise.all([
            fetch(`${EXTERNAL_API_URL}/platforms?key=${key}&page_size=50`),
            fetch(`${EXTERNAL_API_URL}/genres?key=${key}&page_size=50`),
            fetch(`${EXTERNAL_API_URL}/stores?key=${key}&page_size=50`),
            fetch(`${EXTERNAL_API_URL}/developers?key=${key}&page_size=50`),
        ]);

        if (!platformsRes.ok || !genresRes.ok || !storesRes.ok || !developerRes.ok) {
            throw new Error("Failed to fetch filter options from external API.");
        }

        const [platformsData, genresData, storesData, developersData] = await Promise.all([
            platformsRes.json(),
            genresRes.json(),
            storesRes.json(),
            developerRes.json(),
        ]);

        res.json({
            platforms: platformsData.results.map(p => ({ id: p.id, name: p.name, slug: p.slug })),
            genres: genresData.results.map(g => ({ id: g.id, name: g.name, slug: g.slug })),
            stores: storesData.results.map(s => ({ id: s.id, name: s.name, slug: s.slug })),
            developers: developersData.results.map(d => ({ id: d.id, name: d.name, slug: d.slug })),
        });
    } catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ error: "An error occurred while fetching filter options." });
    }
};

export const searchGames = async (req, res) => {
    try {
        const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://api.rawg.io/api";

        const params = new URLSearchParams({
            key: process.env.RAWG_API_KEY,
            page_size: 20,
        });

        if (req.query.q)          params.set('search', req.query.q);
        if (req.query.genres)     params.set('genres', req.query.genres);
        if (req.query.platforms)  params.set('platforms', req.query.platforms);
        if (req.query.metacritic) params.set('metacritic', req.query.metacritic);
        if (req.query.dates)      params.set('dates', req.query.dates);
        if (req.query.ordering)   params.set('ordering', req.query.ordering);
        if (req.query.page)      params.set('page', req.query.page);
        if (req.query.page_size)      params.set('page_size', req.query.page_size);


        const response = await fetch(`${EXTERNAL_API_URL}/games?${params}`);
        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }
        const data = await response.json();

        await saveGamesToDatabase(data.results.map(mapGameFromList));

        const results = data.results.reduce((filtered, game) => {
            if (game.added !== 0) {
                filtered.push({
                    id: game.id,
                    name: game.name,
                    background_image: game.background_image,
                    rating: game.rating,
                    metacritic: game.metacritic,
                    released: game.released,
                    genres: game.genres?.map(g => g.name),
                    platforms: game.platforms?.map(p => p.platform.name),
                });
            }
            return filtered;
        }, []);
        res.json({ count: data.count, results });
    } catch (error) {
        console.error("Error searching games:", error);
        res.status(500).json({ error: "An error occurred while searching games." });
    }
};

export const fetchGameDetailsPage = async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10);
        if (isNaN(gameId)) return res.status(400).json({ error: "Invalid game ID." });
        let game = await Game.findByPk(gameId, {
            include: [{ 
                model: Review, 
                as: 'reviews', 
                attributes: ['id', 'rating', 'comment', 'createdAt', 'updatedAt'], 
                include: [{ 
                    model: User, 
                    as: 'user', 
                    attributes: ['nickname'] 
                }] 
            }]
        });

        if (!game || !game.details_fetched) {
            const details = await fetchGameDetailsFromExternal(gameId);
            if (!game) {
                game = await Game.create(details);
                game.setDataValue('reviews', []);
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