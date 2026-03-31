import { Review } from "../models/Review.js";
import User from "../models/User.js";

const fetchAllReviewsForGame = async (gameId) => {
    try {
        const reviews = await Review.findAll({
            where: { gameId },
            attributes: ['id', 'rating', 'comment', 'createdAt', 'updatedAt'],
            include: [{ model: User, as: 'user', attributes: ['nickname'] }],
            order: [['createdAt', 'DESC']],
        });
        return reviews;
    } catch (error) {
        console.error(`Error fetching reviews for game ID ${gameId}:`, error);
        throw error;
    }
};

export const getReviewsForGame = async (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID." });
    }

    try {
        const reviews = await fetchAllReviewsForGame(gameId);
        res.json({ gameId, reviews });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching reviews." });
    }
};

export const submitReviewForGame = async (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.token;
    const rating = parseInt(req.body.rating, 10);
    const { comment } = req.body;

    if (isNaN(gameId) || isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid input data." });
    }

    try {
        const newReview = await Review.create({
            gameId,
            userId,
            rating,
            comment,
        });

        res.status(201).json(newReview);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: "You have already reviewed this game." });
        }
        console.error(`Error submitting review for game ID ${gameId}:`, error);
        res.status(500).json({ error: "An error occurred while submitting the review." });
    }
};

export const deleteReview = async (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.token;
    if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID." });
    }

    try {
        const review = await Review.findOne({ where: { gameId, userId } });
        if (!review) {
            return res.status(404).json({ error: "Review not found." });
        }
        await review.destroy();
        res.json({ message: "Review deleted successfully." });
    } catch (error) {
        console.error(`Error deleting review for game ID ${gameId}:`, error);
        res.status(500).json({ error: "An error occurred while deleting the review." });
    }
};

export const updateReview = async (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.token;
    const rating = req.body.rating !== undefined ? parseInt(req.body.rating, 10) : undefined;
    const { comment } = req.body;

    if (isNaN(gameId)) {
        return res.status(400).json({ error: "Invalid game ID." });
    }
    if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    try {
        const review = await Review.findOne({ where: { gameId, userId } });
        if (!review) {
            return res.status(404).json({ error: "Review not found." });
        }
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        await review.save();
        res.json(review);
    } catch (error) {
        console.error(`Error updating review for game ID ${gameId}:`, error);
        res.status(500).json({ error: "An error occurred while updating the review." });
    }
};