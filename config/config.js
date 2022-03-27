const dotenv = require('dotenv');
const path = require('path');

let env = 'dev';

// workaround for jest default NODE_ENV value
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
    env = process.env.NODE_ENV;
}
const envPath = path.resolve(__dirname, '..', 'env', `.env.${env}`);

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
    dialect: 'postgres',
    // jest test variables
    apiUrl: process.env.API_URL ?? '',
    apiKeys: process.env.API_KEYS ?? [],
    apiKey: process.env.API_KEY ?? '',
    basicAuth: process.env.BASIC_AUTH ?? [],
    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
    adminLogin: process.env.ADMIN_LOGIN,
    adminPassword: process.env.ADMIN_PASSWORD,
};
