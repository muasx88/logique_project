import yargs from 'yargs';
import { knex } from 'knex';
import knexConfig from './knexfile';

// Add command to create a new migration
yargs.command({
  command: 'make:migration',
  describe: 'Create file migration',
  builder: {
    name: {
      describe: 'Name of migration',
      demandOption: true,
      type: 'string',
    },
    env: {
      describe: 'Set environment database',
      demandOption: false,
      type: 'string',
    },
  },

  //TODO: Argv
  handler: async (argv: any) => {
    await knex({
      ...knexConfig[argv.env || 'local'],
      migrations: {
        directory: './migrations',
        extension: 'ts',
      },
    }).migrate.make(argv.name);
  },
});

yargs.parse();
