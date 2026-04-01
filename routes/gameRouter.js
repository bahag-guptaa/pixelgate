import {Router} from 'express';
import { fetchExplorePageGames, fetchGameDetailsPage, searchGames, fetchFilterOptions } from '../controllers/gameController.js';

const gameRouter = Router();

gameRouter.get('/filters', fetchFilterOptions);
gameRouter.get('/', fetchExplorePageGames);
gameRouter.get('/search', searchGames);
gameRouter.get('/:id', fetchGameDetailsPage);

export default gameRouter;