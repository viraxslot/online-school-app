import express from 'express';
import { v1Methods } from '../endpoints';
import { handleDeleteTeacher, handleGetTeachers, handlePutTeacher } from './user.controller';
const userRouter = express.Router();

userRouter.get('/' + v1Methods.user.teachersList, handleGetTeachers);
userRouter.put('/' + v1Methods.user.teacher, handlePutTeacher);
userRouter.delete('/' + v1Methods.user.teacher, handleDeleteTeacher);

export default userRouter;
