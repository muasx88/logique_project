import 'dotenv/config';
import Knex, { knex } from 'knex';
import config from '~/config';

const knexDb = Knex({
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
});

export default knexDb;
