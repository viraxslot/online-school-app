import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface PermissionAttributes extends DbCommonAttributes {
    title: string;
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id'>

export const Permission: ModelDefined<PermissionAttributes, PermissionCreationAttributes> = sequelize.define('permission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});