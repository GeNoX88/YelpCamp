import { Router } from 'express';
const router = Router();
import { index, createCampground, renderNewForm, showCampground, updateCampground, deleteCampground, renderEditForm } from '../controllers/campgrounds';
import catchAsync from '../utils/catchAsync';
import { isLoggedIn, isAuthor, validateCampground } from '../middleware';
import multer from 'multer';
import { storage } from '../cloudinary';
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground))

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm))


export default router;