import express from 'express';
import { v1Methods } from '../../endpoints';
import { handleNoAuth } from './no-auth.controller';
const noAuthRouter = express.Router();

noAuthRouter.get('/' + v1Methods.auth.noAuth, handleNoAuth);

export default noAuthRouter;
