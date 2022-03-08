import { Permission, Permissions, Role, UserRoles } from '../../db/models';
export class DbHelper {
    static async getRoleId(role: UserRoles): Promise<number | null> {
        const userRole: any = await Role.findOne({
            raw: true,
            where: {
                role,
            },
        });

        return userRole?.id ?? null;
    }

    static async getRoleName(id: number): Promise<string> {
        const userRole: any = await Role.findOne({
            raw: true,
            where: {
                id,
            },
        });

        return userRole?.role ?? null;
    }

    static async getPermissionId(permission: Permissions): Promise<number> {
        const userPermission: any = await Permission.findOne({
            raw: true,
            where: {
                permission,
            },
        });

        return userPermission?.id ?? null;
    }
}
