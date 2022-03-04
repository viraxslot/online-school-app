import bodyParser from 'body-parser';
import express from 'express';
import apiKeyRouter from './api/v1/auth/api-key/api-key.router';
import basicRouter from './api/v1/auth/basic/basic-auth.router';
import noAuthRouter from './api/v1/auth/no-auth/no-auth.router';
import categoryRouter from './api/v1/category/category.router';
import loginRouter from './api/v1/login/login.router';
import swaggerRouter from './api/v1/swagger/swagger.router';
import { UserRoles } from './api/v1/user/user.interfaces';
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
    app.use(versionPrefix + 'api-docs', swaggerRouter);
    // auth
    app.use(versionPrefix, noAuthRouter);
    app.use(versionPrefix, apiKeyRouter);
    app.use(versionPrefix, basicRouter);
    // logic
    app.use(versionPrefix, loginRouter);
    app.use(versionPrefix, userRouter);
    app.use(versionPrefix, categoryRouter);
});

const port = process.env.PORT ?? 4000;

(async () => {
    await sequelize
        .sync()
        .then(async () => {
            for (const role of Object.values(UserRoles)) {
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
