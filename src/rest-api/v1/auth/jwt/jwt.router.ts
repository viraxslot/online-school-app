import express from 'express';
import { checkJwtAuth } from '../../../middleware/check-jwt-auth';
import { v1Methods } from '../../endpoints';
import { handleJwtAuth } from './jwt.controller';
const jwtRouter = express.Router();

jwtRouter.use('/' + v1Methods.auth.jwt, checkJwtAuth, handleJwtAuth);

export default jwtRouter;
