### How to run the project
1. Create `env` folder in the root project folder
2. Create `env/.env.dev` and `env/.env.production` files
3. Add needed environment variables, see [example env file](.env.example). \
   Make sure POSTGRES_DB has different names for `dev` and `production`. \
   Make sure POSTGRES_PASSWORD variable is changed. 
4. Run docker-compose commands \
Dev environment: `npm run dc:dev` \
Production environment: `npm run dc:prod`

### How to apply and undo migrations
Dev environment only:
Apply: `npm run db:migrate:dev`
Undo: `npm run db:undo:dev`

### How to apply/undo seeds to the database
Dev environment only:
Apply: `npm run db:seed:all`
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
### Known problems
1. `jest` tests return `socket hang up` error on the localhost: it's because backend still recompiles, please wait for it.