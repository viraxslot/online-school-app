import express from 'express';
import { body, param } from 'express-validator';
import { Permissions, UserRoles } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import { handleDeleteTeacher, handleGetTeachers, handlePostUser, handlePutTeacher } from './user.controller';
const userRouter = express.Router();

userRouter.get(
    '/' + v1Methods.user.teachers,
    checkJwtAuth,
    checkPermission(Permissions.GetTeacherList),
    handleGetTeachers
);

userRouter.post(
    '/' + v1Methods.user.users,
    body(SchemasV1.UserRequest.required).exists(),
    body('email').isEmail(),
    body('password')
        .isLength({
            min: SchemasV1.UserRequest.properties.password.minLength,
        })
        .withMessage(ApiMessages.login.wrongMinPasswordLength)
        .isLength({
            max: SchemasV1.UserRequest.properties.password.maxLength,
        })
        .withMessage(ApiMessages.login.wrongMaxPasswordLength),
    body('role')
        .custom((value) => {
            return Object.values(UserRoles).includes(value);
        })
        .withMessage(ApiMessages.login.wrongRole(Object.values(UserRoles))),
    checkValidation,
    handlePostUser
);

userRouter.put(
    '/' + v1Methods.user.teachers,
    body('id')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeTeacher),
    handlePutTeacher
);

userRouter.delete(
    '/' + v1Methods.user.teachersById,
    param('id')
        .exists()
        .withMessage(ApiMessages.common.unableParseId)
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.RemoveTeacher),
    handleDeleteTeacher
);

export default userRouter;
