import 'dotenv/config';
import Knex from 'knex';
import config from '~/config';

// console.log(config, 'config');
const connection = {
	host: config.DB_HOST,
	port: config.DB_PORT,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	pool: {
		max: 10,
		min: 2,
	},
};

console.log(connection, 'connection');

const knexDb = Knex({
	client: 'mysql2',
	connection,
});

export default knexDb;
