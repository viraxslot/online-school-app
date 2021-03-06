import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

export enum Permissions {
    // teacher permissions
    GetTeacherList = 'Get teachers list',
    ChangeTeacher = 'Change teacher',
    RemoveTeacher = 'Remove teacher',
    // category permissions
    CreateCategory = 'Create category',
    GetCategory = 'Get category by id',
    GetCategoryList = 'Get category list',
    ChangeCategory = 'Change category',
    RemoveCategory = 'Remove category',
    // course permissions
    CreateCourse = 'Create course',
    GetCourse = 'Get course',
    GetCourseList = 'Get course list',
    GetMineCourseList = 'Get mine course list',
    ChangeCourse = 'Change course',
    RemoveCourse = 'Remove course',
    EnrollCourse = 'Enroll course',
    LeaveCourse = 'Leave course',
    // material permissions
    CreateMaterial = 'Create material',
    GetMaterial = 'Get material',
    GetMaterialList = 'Get material list',
    ChangeMaterial = 'Change material',
    RemoveMaterial = 'Remove material',
    // ban users permissions
    GetBannedUsersList = 'Get banned users list',
    ChangeUserBan = 'Ban or unban user',
    // likes permissions
    ChangeLike = 'Add or remove like',
}

interface PermissionAttributes extends DbCommonAttributes {
    id: number;
    permission: Permissions;
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id'>;

export const Permission: ModelDefined<PermissionAttributes, PermissionCreationAttributes> = sequelize.define(
    'permission',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        permission: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    }
);
