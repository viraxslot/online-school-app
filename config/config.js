const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV ?? 'dev';
const envPath = path.resolve(__dirname, '..', 'env', `.env.${env}`);
console.log('Path to env variables: ', envPath);

const isDocker = process.env.DOCKER_RUN ?? false;
if (!isDocker) {
    process.env.POSTGRES_HOST = 'localhost';
}

dotenv.config({ path: envPath });

module.exports = {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    apiKeys: process.env.API_KEYS ?? [],
    dialect: 'postgres',
};
