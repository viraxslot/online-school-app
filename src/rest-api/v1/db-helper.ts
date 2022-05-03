import { isNil } from 'lodash';
import { Permission, Permissions, Role, User, UserRoles } from '../../db/models';
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

    static async getUserName(id: number): Promise<string | null> {
        const user: any = await User.findOne({
            raw: true,
            where: {
                id,
            },
        });

        if (isNil(user.firstName) && isNil(user.lastName)) {
            return null;
        }

        return user.firstName + ' ' + user.lastName;
    }
}
