import express from 'express';
import { body } from 'express-validator';
import { ApiErrors } from '../../shared/errors';
import { v1Methods } from '../endpoints';
import { handleDeleteTeacher, handleGetTeachers, handlePutTeacher } from './user.controller';
const userRouter = express.Router();

userRouter.get('/' + v1Methods.user.teachers, handleGetTeachers);

userRouter.put(
    '/' + v1Methods.user.teacher,
    body('id', ApiErrors.user.unableToParseTeacherId).exists(),
    body('id', ApiErrors.common.numericIdParameter).isNumeric(),
    handlePutTeacher
);

userRouter.delete('/' + v1Methods.user.teacher, handleDeleteTeacher);

export default userRouter;
