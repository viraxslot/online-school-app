import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { Permission } from './permission.model';
import { Role } from './role.model';

interface RolePermissionAttributes extends DbCommonAttributes {
    roleId: number;
    permissionId: string;
}

type RPAttributesCreationAttributes = Optional<RolePermissionAttributes, 'id'>;

export const RolePermission: ModelDefined<RolePermissionAttributes, RPAttributesCreationAttributes> = sequelize.define(
    'RolePermissions',
    {
        roleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        permissionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    },
    {
        freezeTableName: true,
    }
);

RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'fkRPRole' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'fkRPPermission' });
