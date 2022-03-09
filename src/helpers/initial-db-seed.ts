import { find } from 'lodash';
import { Op } from 'sequelize';
import { PermissionsByRole } from '../db/data/permissions-by-role';
import { Permission, Permissions, Role, UserRoles } from '../db/models';
import { RolePermission } from '../db/models/role-permissions.model';

export async function InitialDbSeed() {
    await createRoles();
    await createPermissions();
    await removeOldPermissionsForRoles();
    await createPermissionsForRoles();
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
    })
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
