import express from 'express';
import { body } from 'express-validator';
import { ApiErrors } from '../../shared/errors';
import { SchemasV1 } from '../schemas';
import { UserRoles } from '../user/user.interfaces';
import { handleSignUp } from './login.controller';
const loginRouter = express.Router();

loginRouter.post(
    '/signup',
    body(SchemasV1.UserRequest.required).exists(),
    body('email').isEmail(),
    body('role', ApiErrors.login.wrongRole(Object.values(UserRoles))).custom((value) => {
        return Object.values(UserRoles).includes(value)
    }),
    handleSignUp
);

export default loginRouter;
