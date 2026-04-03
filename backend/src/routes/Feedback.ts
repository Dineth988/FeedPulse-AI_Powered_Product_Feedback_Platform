import { Router } from 'express';
import { 
    submitFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
    deleteFeedback,
} from '../controllers/FeedbackController';

const router = Router();

// Public
router.post('/', submitFeedback);

// Admin (auth middleware to be added later)
router.get('/',       getAllFeedback);
router.get('/:id',    getFeedbackById);
router.patch('/:id',  updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;