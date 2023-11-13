import 'dotenv/config';
import { createPool } from 'mysql2/promise';
import bluebird from 'bluebird';
import config from '~/config';

const db = createPool({
	connectionLimit: 10,
	host: config.DB_HOST,
	port: config.DB_PORT,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	Promise: bluebird,
});

// db.execute(`CREATE DATABASE IF NOT EXISTS ${config.DB_NAME}`)
// 	.then(() => console.log('init DB'))
// 	.catch((err) => {
// 		console.log('error create db', err.message);
// 		process.exit(1);
// 	})
// 	.finally(() => db.end());

export default db;
