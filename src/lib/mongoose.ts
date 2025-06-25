/**
 * Node Modules
 */
import mongoose from 'mongoose';

/**
 * Custom modules
 */
import config from '@/config';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';
import { logger } from './winston';

/**
 * Client options
 */
const clientOptions: ConnectOptions = {
  dbName: 'the-habits-db',
  appName: 'The Habits API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);

    logger.info('Connected to the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.error('Error connecting to database', error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info('Disconnected from the database successfully.', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.error('Error disconnecting to the database.', error);
  }
};
