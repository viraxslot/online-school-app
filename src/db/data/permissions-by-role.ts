import { UserRoles, Permissions } from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [Permissions.GetCategory, Permissions.GetCategoryList, Permissions.GetUserList],
    [UserRoles.Teacher]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.GetUserList,
        Permissions.ChangeUser,
        Permissions.RemoveUser,
    ],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};
