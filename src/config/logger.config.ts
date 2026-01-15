import type { LoggerConfig } from '../interfaces/ILogger.interface';

export const getLoggerConfig = (): LoggerConfig => {
  const level = (process.env.LOG_LEVEL || 'info') as LoggerConfig['level'];
  const pretty = process.env.NODE_ENV === 'development' || process.env.LOG_PRETTY === 'true';
  
  return {
    level,
    pretty,
  };
};
