import bodyParser from 'body-parser';
import express from 'express';
import { v1Endpoints } from './api/v1/endpoints';
import noAuthRouter from './api/v1/no-auth/no-auth.router';
import swaggerRouter from './api/v1/swagger/swagger.router';

const app = express();
app.use(express.json());

const supportedVersions = ['v1'];

supportedVersions.forEach((version) => {
    const versionPrefix = `/api/${version}/`
    app.use(versionPrefix + v1Endpoints.swagger, swaggerRouter);
    app.use(versionPrefix + v1Endpoints.auth.noAuth, noAuthRouter);
});

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// should be the last middleware
app.use(function (err: any, req: any, res: any, next: any) {
    res.status(500);
    res.json({ error: JSON.stringify(err) });
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
