## Project: REST API for testing

### Project setup

-   [typescript](https://www.typescriptlang.org/)
-   docker compose
-   [express](https://expressjs.com/) REST API with [swagger](https://swagger.io/)
-   postgres database + [sequelize](https://sequelize.org/)
-   [eslint](https://github.com/eslint/eslint) + [husky](https://github.com/typicode/husky) + [lint-staged](https://github.com/okonet/lint-staged) checks
-   JSON schemas
-   API tests based on [axios](https://github.com/axios/axios) + schema validation

### How to run the project

1. Create `env` folder in the root project folder
2. Create `env/.env.development` and `env/.env.production` files
3. Add needed environment variables, see [example env file](.env.example). \
   Make sure POSTGRES_DB has different names for `development` and `production`. \
   Make sure POSTGRES_PASSWORD variable is changed.
4. Run docker-compose commands \
   Dev environment: `npm run dc:dev` \
   Production environment: `npm run dc:prod`

### How to apply and undo migrations

Dev environment only:
Apply: `npm run db:migrate`\
Undo: `npm run db:migrate:undo`

To create a new migration please use:
`npx sequelize-cli migration:create --name=<MIGRATION_NAME` 

### How to apply/undo seeds to the database

Dev environment only:
Apply: `npm run db:seed:all`\
Undo: `npm run db:seed:undo`

### How to init database from scratch

Use case: if you need to recreate table with a lot of relations.

1. Search for the volume: `docker volume ls`
2. Remove volume "online-school-app_pg-data": `docker volume rm online-school-app_pg-data`
3. Run app: `npm run dc:dev` - database will be created from scratch

### How to run tests

If it's the first run please execute the command: `npm run db:seed:all`
It'll create all data needed for tests.

Dev mode: `npm test`
CI mode: `npm run test:nowatch`

### How to add new role

1. Update `UserRoles` enum in [user model](src/db/models/user.model.ts)
2. Add permissions to user in [this file](src/db/data/permissions-by-role.ts)
3. Permissions for roles will be updated with `InitialDbSeed` function on app start

### Other

To covert DOCS.md to pdf please do the following:

1. Install this package globally `npm i -g md-to-pdf`
2. Run `cat DOCS.md | md-to-pdf > ./pdf/online-school-api-docs.pdf`
3. Upload PDF wherever you want

Please do not add PDF file to git.
