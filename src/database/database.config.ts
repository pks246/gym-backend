import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean,
): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};

const parseNumber = (
  value: string | undefined,
  defaultValue: number,
): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
};

export const createDatabaseOptions = (): TypeOrmModuleOptions => {
  const isTestEnvironment = process.env.NODE_ENV === 'test';
  const useSsl = parseBoolean(process.env.DB_SSL, false);

  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'Ithecool2_',
    database: process.env.DB_NAME ?? 'gym_management',
    autoLoadEntities: true,
    synchronize: parseBoolean(process.env.DB_SYNCHRONIZE, false),
    logging: parseBoolean(process.env.DB_LOGGING, false),
    ssl: useSsl
      ? {
          rejectUnauthorized: parseBoolean(
            process.env.DB_SSL_REJECT_UNAUTHORIZED,
            false,
          ),
        }
      : false,
    retryAttempts: parseNumber(
      process.env.DB_RETRY_ATTEMPTS,
      isTestEnvironment ? 0 : 3,
    ),
    retryDelay: parseNumber(process.env.DB_RETRY_DELAY, 3000),
    manualInitialization: parseBoolean(
      process.env.DB_MANUAL_INITIALIZATION,
      isTestEnvironment,
    ),
  };
};
