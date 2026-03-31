import {Router} from 'express';
import { fetchExplorePageGames, fetchGameDetailsPage, searchGames } from '../controllers/gameController.js';

const gameRouter = Router();

gameRouter.get('/', fetchExplorePageGames);
gameRouter.get('/search', searchGames);
gameRouter.get('/:id', fetchGameDetailsPage);

export default gameRouter;