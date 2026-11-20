import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const log = logger.child({ module: 'database' });

// Reject unknown query fields and neutralise `$`-operator injection from user input.
mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);

mongoose.connection.on('connected', () => log.info('MongoDB connected'));
mongoose.connection.on('disconnected', () => log.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => log.info('MongoDB reconnected'));
mongoose.connection.on('error', (error: Error) => log.error({ err: error }, 'MongoDB error'));

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
    autoIndex: env.NODE_ENV !== 'production',
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}
