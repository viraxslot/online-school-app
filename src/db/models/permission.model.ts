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
}

interface PermissionAttributes extends DbCommonAttributes {
    id: number;
    permission: string;
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
