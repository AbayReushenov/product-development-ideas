import { Router } from 'express';
import { IdeaController } from '../controllers/IdeaController';
import { extractClientIP } from '../middleware/ipExtractor';

const router = Router();
const ideaController = new IdeaController();

router.use(extractClientIP);

router.get('/', ideaController.getIdeas);
router.post('/:id/vote', ideaController.voteForIdea);
router.get('/votes/my', ideaController.getMyVotes);

export default router;