import {UserRoles, Permissions} from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
    ],
    [UserRoles.Teacher]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.CreateCategory,
        Permissions.ChangeCategory,
        Permissions.RemoveCategory,
    ]
}