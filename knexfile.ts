import 'dotenv/config';
import config from './src/config';
import type { Knex } from 'knex';

const knexConfig: { [key: string]: Knex.Config } = {
  local: {
    client: 'mysql2',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      pool: {
        max: 10,
        min: 2,
      },
    },
  },

  development: {
    client: 'mysql2',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      pool: {
        max: 10,
        min: 2,
      },
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

export default knexConfig;
