import express from 'express';
import { body } from 'express-validator';
import { checkValidation } from '../../middleware/check-validation';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import { handlePostSession } from './login.controller';
const loginRouter = express.Router();

loginRouter.post(
    '/' + v1Methods.login.session,
    body(SchemasV1.SessionRequest.required).exists(),
    checkValidation,
    handlePostSession
);

export default loginRouter;
