/**
 * Custom Modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExists = await Token.exists({ token: refreshToken });

    if (!tokenExists) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired, please login again.',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token.',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      mesage: 'Internal server error',
      error: error,
    });

    logger.error('Error during refresh token', error);
  }
};

export default refreshToken;
