const dotenv = require('dotenv');
const path = require('path');
const { isNil } = require('lodash');

let env = 'development';

// workaround for jest default NODE_ENV value
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
    env = process.env.NODE_ENV;
}
const envPath = path.resolve(__dirname, '..', 'env', `.env.${env}`);
dotenv.config({ path: envPath });

const keepDbHost = (env === 'development' && !isNil(process.env.JEST_RUN)) ? false : true;
module.exports = {
    env,
    host: keepDbHost ? process.env.POSTGRES_HOST : 'localhost',
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
    adminLogin: process.env.ADMIN_LOGIN ?? '',
    adminPassword: process.env.ADMIN_PASSWORD ?? '',
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretKeyId: process.env.AWS_SECRET_ACCESS_KEY ?? '',
        region: process.env.AWS_REGION ?? 'us-east-2',
        cloudWatchLogGroup: process.env.AWS_CLOUD_WATCH_LOG_GROUP ?? '/docker-compose/online-school-app'
    }
};
