/**
 * Node Modules
 */
import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * Controllers
 */

/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authenticate from '@/middlewares/authenticate';

/**
 * Models
 */
import User from '@/models/user';

const router = Router();

export default router;
