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

    static async getUserData(id: number): Promise<{
        username: string;
        email: string;
        firstName: string;
        lastName: string;
    }> {
        const result: any = await User.findOne({
            raw: true,
            where: {
                id,
            },
        });

        return {
            username: result.username,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
        };
    }

    /**
     * Return firstName + lastName if they're not empty or login otherwise
     * @param id
     */
    static async getUserIdentifier(id: number): Promise<string> {
        const user = await this.getUserData(id);

        let username = user.username;
        if (!isNil(user.firstName) || !isNil(user.lastName)) {
            username = user.firstName + ' ' + user.lastName;
        }

        return username;
    }
}
