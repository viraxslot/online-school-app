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
Dev environment:
Apply: `npm run db:migrate:dev`
Undo: `npm run db:undo:dev`

### How to seed the database with fake data