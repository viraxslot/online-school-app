import express from 'express';
import { body } from 'express-validator';
import { ApiMessages } from '../../shared/api-messages';
import { SchemasV1 } from '../schemas';
import { UserRoles } from '../user/user.interfaces';
import { handleSignIn, handleSignUp } from './login.controller';
const loginRouter = express.Router();

loginRouter.post(
    '/signup',
    body(SchemasV1.UserRequest.required).exists(),
    body('email').isEmail(),
    body('role', ApiMessages.login.wrongRole(Object.values(UserRoles))).custom((value) => {
        return Object.values(UserRoles).includes(value)
    }),
    handleSignUp
);

loginRouter.post('/signin', handleSignIn);

export default loginRouter;
