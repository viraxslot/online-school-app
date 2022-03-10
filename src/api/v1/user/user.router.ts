import express from 'express';
import { body, param } from 'express-validator';
import { Permissions } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { handleDeleteTeacher, handleGetTeachers, handlePutTeacher } from './user.controller';
const userRouter = express.Router();

userRouter.get(
    '/' + v1Methods.user.teachers,
    checkJwtAuth,
    checkPermission(Permissions.GetTeacherList),
    handleGetTeachers
);

userRouter.put(
    '/' + v1Methods.user.teacher,
    body('id', ApiMessages.common.unableToParseId).exists(),
    body('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeTeacher),
    handlePutTeacher
);

userRouter.delete(
    '/' + v1Methods.user.teacherId,
    param('id', ApiMessages.common.unableToParseId).exists(),
    param('id', ApiMessages.common.numericParameter).isNumeric(),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.RemoveTeacher),
    handleDeleteTeacher
);

export default userRouter;
