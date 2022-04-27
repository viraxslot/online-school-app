import express from 'express';
import { getSwaggerData } from '../../../helpers/get-swagger-data';
import swaggerUi from 'swagger-ui-express';
const swaggerRouter = express.Router();

swaggerRouter.use('/', swaggerUi.serve);

const swaggerData = getSwaggerData('1.0.0', ['v1']);
swaggerRouter.get('/', swaggerUi.setup(swaggerData));

export default swaggerRouter;
