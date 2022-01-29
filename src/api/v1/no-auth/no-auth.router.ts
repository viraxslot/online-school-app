import express from 'express';
import { handleNoAuth } from './no-auth.controller';
const noAuthRouter = express.Router();

noAuthRouter.get('/', handleNoAuth);

export default noAuthRouter;
