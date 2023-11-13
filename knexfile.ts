import 'dotenv/config';
import config from './src/config';
import type { Knex } from 'knex';

// Update with your config settings.

const knexConfig: { [key: string]: Knex.Config } = {
	local: {
		client: 'mysql',
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
		client: 'mysql',
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
		client: 'mysql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password',
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
