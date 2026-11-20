import type { Server } from 'node:http';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: Server | undefined;
let isShuttingDown = false;

async function shutdown(reason: string, exitCode: number): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info({ reason }, 'Shutting down');

  // Force-exit if connections refuse to drain in time.
  setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
        server?.closeIdleConnections();
      });
    }
    await disconnectDatabase();
    logger.info('Shutdown complete');
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    exitCode = 1;
  }

  process.exit(exitCode);
}

// A rejected promise nobody handled means state is unknown: log and exit gracefully.
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  void shutdown('unhandledRejection', 1);
});

// After an uncaught exception the process is in an undefined state: exit immediately
// and let the process manager (Docker, PM2, platform) restart it.
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});

process.on('SIGTERM', () => void shutdown('SIGTERM', 0));
process.on('SIGINT', () => void shutdown('SIGINT', 0));

async function bootstrap(): Promise<void> {
  // Fail fast: never accept traffic without a working database connection.
  await connectDatabase();

  const app = createApp();
  server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });
  server.on('error', (error) => {
    logger.fatal({ err: error }, 'HTTP server error');
    process.exit(1);
  });
}

bootstrap().catch((error: unknown) => {
  logger.fatal({ err: error }, 'Failed to start server');
  process.exit(1);
});
