import { Router } from 'express';
import { login } from './auth.controller.js';
import { loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);

export default router;