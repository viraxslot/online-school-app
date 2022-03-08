import express from 'express';
import { body, param } from 'express-validator';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { handleDeleteTeacher, handleGetTeachers, handlePutTeacher } from './user.controller';
const userRouter = express.Router();

userRouter.get('/' + v1Methods.user.teachers, handleGetTeachers);

userRouter.put(
    '/' + v1Methods.user.teacher,
    body('id', ApiMessages.common.unableToParseId).exists(),
    body('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    handlePutTeacher
);

userRouter.delete(
    '/' + v1Methods.user.teacherId,
    param('id', ApiMessages.common.unableToParseId).exists(),
    param('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    handleDeleteTeacher
);

export default userRouter;
