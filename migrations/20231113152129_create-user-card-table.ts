import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
      CREATE TABLE user_card (
         id INT AUTO_INCREMENT PRIMARY KEY,
         user_id INT,
         creditcard_type VARCHAR(255) NOT NULL,
         creditcard_number VARCHAR(255) NOT NULL,
         creditcard_name VARCHAR(255) NOT NULL,
         creditcard_expired DATE NOT NULL,
         creditcard_cvv VARCHAR(255) NOT NULL,
         FOREIGN KEY (user_id) REFERENCES users(id)
   );
   `);
}

export async function down(knex: Knex): Promise<void> {}
