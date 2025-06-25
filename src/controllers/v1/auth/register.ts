/**
 * Custom Modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateUsername } from '@/utils';

/**
 * Models
 */
import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

type UserData = Pick<IUser, 'email' | 'password'>;

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body as UserData;

  try {
    const username = generateUsername();

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({ token: refreshToken, userId: newUser._id });

    logger.info('Refresh token created for user:', {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
      },
      accessToken,
    });

    logger.info('User registered successfuly.', {
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during user registration', error);
  }
};

export default register;
