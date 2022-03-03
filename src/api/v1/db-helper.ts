import { Role } from '../../db/models';
import { UserRoles } from './user/user.interfaces';

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
}
