import express from 'express';
import { body } from 'express-validator';
import { ApiErrors } from '../../shared/errors';
import { SchemasV1 } from '../schemas';
import { handleSignUp } from './login.controller';
import { LoginRoles } from './login.interfaces';
const loginRouter = express.Router();

loginRouter.post(
    '/signup',
    body(SchemasV1.SignUpRequest.required).exists(),
    body('email').isEmail(),
    body('role', ApiErrors.login.wrongRole(Object.values(LoginRoles))).custom((value) => {
        return Object.values(LoginRoles).includes(value)
    }),
    handleSignUp
);

export default loginRouter;
