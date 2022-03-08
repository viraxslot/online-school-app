import express from 'express';
import { body } from 'express-validator';
import { UserRoles } from '../../../db/models';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { SchemasV1 } from '../schemas';
import { handleSignIn, handleSignUp } from './login.controller';
const loginRouter = express.Router();

loginRouter.post(
    '/signup',
    body(SchemasV1.UserRequest.required).exists(),
    body('email').isEmail(),
    body('password', ApiMessages.login.wrongMinPasswordLength).isLength({
        min: SchemasV1.UserRequest.properties.password.minLength
    }),
    body('password', ApiMessages.login.wrongMaxPasswordLength).isLength({
        max: SchemasV1.UserRequest.properties.password.maxLength
    }),
    body('role', ApiMessages.login.wrongRole(Object.values(UserRoles))).custom((value) => {
        return Object.values(UserRoles).includes(value);
    }),
    checkValidation,
    handleSignUp
);

loginRouter.post('/signin', body(SchemasV1.SignInRequest.required).exists(), checkValidation, handleSignIn);

export default loginRouter;
