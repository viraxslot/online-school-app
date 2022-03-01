import express from 'express';
import { v1Methods } from '../endpoints';
import { handleGetTeachers } from './user.controller';
const userRouter = express.Router();

userRouter.get('/' + v1Methods.user.teachersList, handleGetTeachers);

export default userRouter;
