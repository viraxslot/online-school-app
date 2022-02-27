import bodyParser from 'body-parser';
import express from 'express';
import { v1Endpoints } from './api/v1/endpoints';
import noAuthRouter from './api/v1/auth/no-auth/no-auth.router';
import swaggerRouter from './api/v1/swagger/swagger.router';
import sequelize from './db/sequelize';
// without this import sequelize.sync() won't work
import * as models from './db/models/index';
import loginRouter from './api/v1/login/login.router';
import { LoginRoles } from './api/v1/login/login.interfaces';

const app = express();
app.use(bodyParser.json());

const supportedVersions = ['v1'];
supportedVersions.forEach((version) => {
    const versionPrefix = `/api/${version}/`;
    app.use(versionPrefix + v1Endpoints.swagger, swaggerRouter);
    app.use(versionPrefix + v1Endpoints.auth, noAuthRouter);
    app.use(versionPrefix + v1Endpoints.login, loginRouter);
});

const port = process.env.PORT ?? 4000;
sequelize
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
