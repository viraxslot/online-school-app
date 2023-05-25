import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import apiKeyRouter from './rest-api/v1/auth/api-key/api-key.router';
import basicRouter from './rest-api/v1/auth/basic/basic-auth.router';
import jwtRouter from './rest-api/v1/auth/jwt/jwt.router';
import noAuthRouter from './rest-api/v1/auth/no-auth/no-auth.router';
import categoryRouter from './rest-api/v1/category/category.router';
import courseRouter from './rest-api/v1/course/course.router';
import healthRouter from './rest-api/v1/health/health.router';
import loginRouter from './rest-api/v1/login/login.router';
import swaggerRouter from './rest-api/v1/swagger/swagger.router';
import userRouter from './rest-api/v1/user/user.router';
import sequelize from './db/sequelize';
import { initialDbSeed } from './helpers/initial-db-seed';
import { logger } from './helpers/winston-logger';
import './helpers/jobs';
import { ApiMessages } from './rest-api/shared/api-messages';
import bannedUsersRouter from './rest-api/v1/ban-user/banned-users.router';
import appConfig from '../config/app-config';
import cookieRouter from './rest-api/v1/auth/cookie/cookie-auth.router';
import signInRouter from './rest-api/v1/auth/sign-in/sign-in.router';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const supportedVersions = ['v1'];
supportedVersions.forEach((version) => {
    const versionPrefix = `/api/${version}/`;
    // swagger
    app.use(versionPrefix + 'api-docs', swaggerRouter);
    // auth
    app.use(versionPrefix, signInRouter);
    app.use(versionPrefix, noAuthRouter);
    app.use(versionPrefix, apiKeyRouter);
    app.use(versionPrefix, basicRouter);
    app.use(versionPrefix, cookieRouter);
    app.use(versionPrefix, jwtRouter);
    // logic
    app.use(versionPrefix, healthRouter);
    app.use(versionPrefix, loginRouter);
    app.use(versionPrefix, userRouter);
    app.use(versionPrefix, categoryRouter);
    app.use(versionPrefix, courseRouter);
    // ban user
    app.use(versionPrefix, bannedUsersRouter);
});

app.use('*', function (req, res) {
    res.status(400).json({ error: ApiMessages.common.noSuchEndpoint });
});

const port = process.env.PORT ?? 4000;

(async () => {
    try {
        if (appConfig) {
            await sequelize.sync();
        }
        await initialDbSeed();

        logger.info('Database is synchronized');
        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    } catch (err) {
        logger.error(JSON.stringify(err));
    }
})();
