import express from 'express';
import { body, param } from 'express-validator';
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

userRouter.delete(
    '/' + v1Methods.user.teacherId,
    param('id', ApiErrors.user.unableToParseTeacherId).exists(),
    param('id', ApiErrors.common.numericIdParameter).isNumeric(),
    handleDeleteTeacher
);

export default userRouter;
