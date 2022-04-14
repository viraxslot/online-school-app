import { UserRoles, Permissions } from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.GetTeacherList,
        Permissions.GetCourse,
        Permissions.GetCourseList,
        Permissions.GetMaterial,
        Permissions.GetMaterialList,
        Permissions.EnrollCourse,
        Permissions.LeaveCourse,
    ],
    [UserRoles.Teacher]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.GetTeacherList,
        Permissions.ChangeTeacher,
        Permissions.RemoveTeacher,
        Permissions.GetCourse,
        Permissions.GetCourseList,
        Permissions.CreateCourse,
        Permissions.ChangeCourse,
        Permissions.RemoveCourse,
        Permissions.GetMaterial,
        Permissions.GetMaterialList,
        Permissions.CreateMaterial,
        Permissions.ChangeMaterial,
        Permissions.RemoveMaterial,
    ],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};
