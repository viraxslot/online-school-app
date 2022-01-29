import express from 'express';
import { v1Endpoints } from './api/v1/endpoints';
import noAuthRouter from './api/v1/no-auth/no-auth.router';
import swaggerRouter from './api/v1/swagger/swagger.router';

const app = express();
app.use(express.json());

/**
 * All endpoints for v1 API
 */
// swagger
app.use(v1Endpoints.swagger, swaggerRouter);
// auth
app.use(v1Endpoints.auth.noAuth, noAuthRouter);

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
    res.status(500);
    res.json({ error: JSON.stringify(err) });

    next();
});

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
