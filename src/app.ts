import bodyParser from 'body-parser';
import express from 'express';
import apiKeyRouter from './api/v1/auth/api-key/api-key.router';
import basicRouter from './api/v1/auth/basic/basic-auth.router';
import noAuthRouter from './api/v1/auth/no-auth/no-auth.router';
import { v1Endpoints } from './api/v1/endpoints';
import { LoginRoles } from './api/v1/login/login.interfaces';
import loginRouter from './api/v1/login/login.router';
import swaggerRouter from './api/v1/swagger/swagger.router';
import userRouter from './api/v1/user/user.router';
// without this import sequelize.sync() won't work
import * as models from './db/models/index';
import sequelize from './db/sequelize';

const app = express();
app.use(bodyParser.json());

const supportedVersions = ['v1'];
supportedVersions.forEach((version) => {
    const versionPrefix = `/api/${version}/`;
    // swagger
    app.use(versionPrefix + v1Endpoints.swagger, swaggerRouter);
    // auth
    app.use(versionPrefix + v1Endpoints.auth, noAuthRouter);
    app.use(versionPrefix + v1Endpoints.auth, apiKeyRouter);
    app.use(versionPrefix + v1Endpoints.auth, basicRouter);
    // login
    app.use(versionPrefix + v1Endpoints.login, loginRouter);
    // user
    app.use(versionPrefix + v1Endpoints.user, userRouter);
});

const port = process.env.PORT ?? 4000;

(async () => {
    await sequelize
        .sync()
        .then(async () => {
            for (const role of Object.values(LoginRoles)) {
                await models.Role.findOrCreate({
                    where: {
                        role,
                    },
                    defaults: {
                        role,
                    },
                });
            }
        })
        .then(() => {
            console.log('Database is synchronized');
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        })
        .catch((err) => {
            console.error(JSON.stringify(err));
        });
})();
