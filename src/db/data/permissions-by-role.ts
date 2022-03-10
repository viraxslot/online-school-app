import { UserRoles, Permissions } from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [Permissions.GetCategory, Permissions.GetCategoryList, Permissions.GetTeacherList],
    [UserRoles.Teacher]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.GetTeacherList,
        Permissions.ChangeTeacher,
        Permissions.RemoveTeacher,
    ],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};
