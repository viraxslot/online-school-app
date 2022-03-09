import { UserRoles, Permissions } from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [Permissions.GetCategory, Permissions.GetCategoryList],
    [UserRoles.Teacher]: [Permissions.GetCategory, Permissions.GetCategoryList],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};
