import express from 'express';
import { v1Methods } from '../../endpoints';
import { handleSignIn } from './sign-in.controller';
const signInRouter = express.Router();

signInRouter.post('/' + v1Methods.auth.signIn, handleSignIn);
export default signInRouter;
