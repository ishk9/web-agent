export interface LoggerConfig {
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    pretty?: boolean;
    destination?: string | number;
  }