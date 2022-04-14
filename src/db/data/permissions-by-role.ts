import { Permissions, UserRoles } from '../models';

const PermissionsByRole = {
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
        Permissions.GetMineCourseList
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
        Permissions.GetMineCourseList
    ],
    [UserRoles.Admin]: [...Object.values(Permissions)],
};

// remove roles
PermissionsByRole[UserRoles.Admin] = PermissionsByRole[UserRoles.Admin].filter(p => {
    return ![Permissions.EnrollCourse, Permissions.LeaveCourse].includes(p);
});

export { PermissionsByRole };
