import express from 'express';
import { v1Methods } from '../endpoints';
import { handleGetHealth } from './health.controller';
const healthRouter = express.Router();

healthRouter.get('/' + v1Methods.health.health, handleGetHealth);

export default healthRouter;
