import { Router } from "express";
import { getReviewsForGame, submitReviewForGame, deleteReview, updateReview } from "../controllers/ReviewController.js";
import { checkToken } from "../middlewares/checkToken.js";

const reviewRouter = Router();

reviewRouter.get("/games/:id/reviews", getReviewsForGame);
reviewRouter.post("/games/:id/reviews", checkToken, submitReviewForGame);
reviewRouter.delete("/games/:id/reviews", checkToken, deleteReview);
reviewRouter.put("/games/:id/reviews", checkToken, updateReview);

export default reviewRouter;
