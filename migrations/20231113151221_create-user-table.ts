import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
      CREATE TABLE users (
         id INT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         address VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL,
         photo_url VARCHAR(255) DEFAULT NULL
      )
   `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users');
}
