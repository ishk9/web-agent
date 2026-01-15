import pino from 'pino';
import { getLoggerConfig } from '../config/logger.config';

const config = getLoggerConfig();

const loggerOptions: pino.LoggerOptions = {
  level: config.level,
};

if (config.pretty) {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  };
}

const logger = pino(loggerOptions);

export default logger;
