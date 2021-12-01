import { Router } from 'express';
const router = Router();
import { authenticate } from 'passport';
import catchAsync from '../utils/catchAsync';
import { renderRegister, register, renderLogin, login, logout } from '../controllers/users';

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLogin)
    .post(authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login)

router.get('/logout', logout)

export default router;
