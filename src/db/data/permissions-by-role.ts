import { UserRoles, Permissions } from '../models';

export const PermissionsByRole = {
    [UserRoles.Student]: [
        Permissions.GetCategory,
        Permissions.GetCategoryList,
        Permissions.GetTeacherList,
        Permissions.GetCourse,
        Permissions.GetCourseList,
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
    ],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};
