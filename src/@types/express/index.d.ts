/**
 * @copyright 2025 ssajudn
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import * as express from 'express';

/**
 * Types
 */
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
