import bodyParser from 'body-parser';
import express from 'express';
import { v1Endpoints } from './api/v1/endpoints';
import noAuthRouter from './api/v1/no-auth/no-auth.router';
import swaggerRouter from './api/v1/swagger/swagger.router';
import sequelize from './db/sequelize';
// without this import sequelize.sync() won't work
import './db/models/index';

const app = express();
app.use(express.json());

const supportedVersions = ['v1'];

supportedVersions.forEach((version) => {
    const versionPrefix = `/api/${version}/`;
    app.use(versionPrefix + v1Endpoints.swagger, swaggerRouter);
    app.use(versionPrefix + v1Endpoints.auth.noAuth, noAuthRouter);
});

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// should be the last middleware
app.use(function (err: any, req: any, res: any) {
    res.status(500);
    res.json({ error: JSON.stringify(err) });
});

const port = process.env.PORT ?? 4000;
sequelize
    .sync()
    .then(() => {
        console.log('Database is synchronized');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(JSON.stringify(err));
    });
