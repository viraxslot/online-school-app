import express from 'express';
import { jwtAuth } from '../../../middleware/jwt-auth';
import { v1Methods } from '../../endpoints';
import { handleJwtAuth } from './jwt.controller';
const jwtRouter = express.Router();

jwtRouter.use('/' + v1Methods.auth.jwt, jwtAuth, handleJwtAuth);

export default jwtRouter;
