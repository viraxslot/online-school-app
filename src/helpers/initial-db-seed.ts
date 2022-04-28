import { find, isNil } from 'lodash';
import { Op } from 'sequelize';
import config from '../../config/config';
import { ApiHelper } from '../../test/helpers/api-helper';
import { PermissionsByRole } from '../db/data/permissions-by-role';
import { Permission, Permissions, Role, User, UserRoles } from '../db/models';
import { RolePermission } from '../db/models/role-permissions.model';
import { logger } from './winston-logger';

export async function initialDbSeed() {
    try {
        logger.info('Trying to create initial data');
        await createRoles();
        await createPermissions();
        await removeOldPermissionsForRoles();
        await createPermissionsForRoles();
        await createAdminUser();
        logger.info('Initial data was successfully created');
    }
    catch (err) {
        logger.error('Unable to add the initial data: ' + JSON.stringify(err));
    }
}

async function createRoles() {
    for (const role of Object.values(UserRoles)) {
        await Role.findOrCreate({
            where: {
                role,
            },
            defaults: {
                role,
            },
        });
    }
}

async function createPermissions() {
    for (const permission of Object.values(Permissions)) {
        await Permission.findOrCreate({
            where: {
                permission,
            },
            defaults: {
                permission,
            },
        });
    }
}

async function removeOldPermissionsForRoles() {
    await RolePermission.destroy({
        where: {},
        truncate: true
    });
}

async function createPermissionsForRoles() {
    const roles: any = await Role.findAll({
        raw: true,
    });

    const permissions: any = await Permission.findAll({
        raw: true,
    });

    for (const role of roles) {
        const permissionsForRole = (PermissionsByRole as any)[role.role] ?? [];
        for (const permForRole of permissionsForRole) {
            const permission = find(permissions, (el) => el.permission === permForRole);

            if (permission) {
                await RolePermission.findOrCreate({
                    where: {
                        [Op.and]: [{ roleId: role.id }, { permissionId: permission.id }],
                    },
                    defaults: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
            }
        }
    }
}

async function createAdminUser() {
    const adminUser = await User.findOne({
        where: {
            login: config.adminLogin,
        }
    });

    if (isNil(adminUser)) {
        await ApiHelper.createUser({
            login: config.adminLogin,
            password: config.adminPassword,
            email: 'admin@quantori.academy',
            role: UserRoles.Admin
        });
    }
}