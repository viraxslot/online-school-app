import express from 'express';
import { body } from 'express-validator';
import { checkValidation } from '../../middleware/check-validation';
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
        return Object.values(UserRoles).includes(value);
    }),
    checkValidation,
    handleSignUp
);

loginRouter.post('/signin', body(SchemasV1.SignInRequest.required).exists(), checkValidation, handleSignIn);

export default loginRouter;
