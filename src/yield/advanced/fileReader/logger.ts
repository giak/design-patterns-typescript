import { createLogger, format, transports } from 'winston';
import { CONFIG } from './config';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
  ),
  transports: [new transports.Console(), new transports.File({ filename: CONFIG.LOG_FILE_PATH })],
});
