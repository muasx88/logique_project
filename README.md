# Express App Typescript

### This project is a project base test using express, typescript, knex, and mysql

### How to run

- clone project
- run `nvm use` to switch node version to v18, make sure you already install nvm
- run `npm install` or `pnpm install` or `yarn install`
- create database on your local machine
- copy and paste file `.env-example` to `.env` and fill the blank with your setting
- run `pnpm migrate:up` to run the migration
- run `pnpm run dev` to run as development

### How to run (using docker)

- clone project
- run `make dev`
