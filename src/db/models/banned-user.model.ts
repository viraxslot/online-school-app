import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface BannedUserAttributes extends DbCommonAttributes {
    userId: number;
    reason: string;
    createdBy: string;
}

type BannedUserCreationAttributes = Optional<BannedUserAttributes, 'id'>;

export const BannedUser: ModelDefined<BannedUserAttributes, BannedUserCreationAttributes> = sequelize.define(
    'bannedUser',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);
