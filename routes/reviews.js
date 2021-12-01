import { Router } from 'express';
const router = Router({ mergeParams: true });
import { validateReview, isLoggedIn } from '../middleware';
import { createReview, deleteReview } from '../controllers/reviews';
import catchAsync from '../utils/catchAsync';


router.post('/', isLoggedIn, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, catchAsync(deleteReview));

export default router;