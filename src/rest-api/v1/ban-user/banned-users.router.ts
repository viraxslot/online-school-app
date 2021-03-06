import express from 'express';
import { body, query } from 'express-validator';
import { isNil } from 'lodash';
import { Permissions, User } from '../../../db/models';
import { checkJwtAuth } from '../../middleware/check-jwt-auth';
import { checkPermission } from '../../middleware/check-permission';
import { checkValidation } from '../../middleware/check-validation';
import { ApiMessages } from '../../shared/api-messages';
import { v1Methods } from '../endpoints';
import { SchemasV1 } from '../schemas';
import { handleChangeUserBanRequest, handleGetBannedUsersListRequest } from './banned-users.controller';
const bannedUsersRouter = express.Router();

bannedUsersRouter.post(
    '/' + v1Methods.bannedUsers.banUserWildcard,
    query('userId')
        .isNumeric()
        .withMessage(ApiMessages.common.numericParameter)
        .custom(async (userId: string) => {
            const user = await User.findOne({
                raw: true,
                where: {
                    id: userId,
                },
            });

            if (isNil(user)) {
                throw new Error(ApiMessages.user.noUser);
            }
        }),
    query('ban').isBoolean().withMessage(ApiMessages.common.booleanParameter),
    body('reason')
        .isString()
        .withMessage(ApiMessages.common.stringParameter)
        .isLength({
            min: SchemasV1.ChangeUserBanRequest.properties.reason.minLength,
        })
        .withMessage(ApiMessages.bannedUsers.wrongMinReasonLength)
        .isLength({
            max: SchemasV1.ChangeUserBanRequest.properties.reason.maxLength,
        })
        .withMessage(ApiMessages.bannedUsers.wrongMaxReasonLength),
    checkValidation,
    checkJwtAuth,
    checkPermission(Permissions.ChangeUserBan),
    handleChangeUserBanRequest
);

bannedUsersRouter.get(
    '/' + v1Methods.bannedUsers.bannedUsers,
    checkJwtAuth,
    checkPermission(Permissions.GetBannedUsersList),
    handleGetBannedUsersListRequest
);

export default bannedUsersRouter;
