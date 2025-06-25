/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';

/**
 * Router
 */

/**
 * Types
 */
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */
const app = express();

// Configure cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGIN.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.error(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

// Apply cors middleware
app.use(cors(corsOptions));

// Enable jSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via querystring
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Enable response compression to reduce patload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  }),
);

// User Helmet to enchance security by setting various HTTP Headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.get('/', (req, res) => {
      res.json({
        message: 'Hello World',
      });
    });

    app.listen(config.PORT, () => {
      logger.info(`Server running at: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();

    logger.warn('Server SHUTDOWN');
    process.exit(1);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
