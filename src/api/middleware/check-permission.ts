import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { Op } from 'sequelize';
import { Permissions, RolePermission } from '../../db/models';
import { ApiMessages } from '../shared/api-messages';
import { DefaultResponse } from '../shared/interfaces';
import { DbHelper } from '../v1/db-helper';

export function checkPermission(permission: Permissions) {
    return async function (req: Request, res: DefaultResponse, next: NextFunction) {
        let permissionId: any;
        try {
            permissionId = await DbHelper.getPermissionId(permission);
            if (isNil(permissionId)) {
                return res.status(500).json({ errors: ApiMessages.permission.noPermission });
            }
        } catch (err) {
            return res.status(500).json({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
        }

        const token: any = req?.headers?.authorization?.replace('Bearer ', '');

        if (isNil(token)) {
            return res.status(400).json({ errors: ApiMessages.common.tokenIsNotSet });
        }

        const decoded: any = jwt.decode(token);
        const roleId = decoded?.roleId;

        let rolePermission: any;
        try {
            rolePermission = await RolePermission.findOne({
                raw: true,
                where: {
                    [Op.and]: [{ roleId }, { permissionId: permissionId }],
                },
            });
        } catch (err) {
            return res.status(500).json({ errors: ApiMessages.common.unexpectedError + `: ${err}` });
        }

        if (isNil(rolePermission)) {
            const role = await DbHelper.getRoleName(roleId);
            return res.status(403).json({ errors: ApiMessages.common.forbiddenForRole(role) });
        }

        next();
    };
}
