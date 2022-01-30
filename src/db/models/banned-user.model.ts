import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface BannedUserAttributes extends DbCommonAttributes {
    title: string;
    bannedBy: string;
}

interface BannedUserCreationAttributes extends Optional<BannedUserAttributes, 'id'> {}

export const BannedUser: ModelDefined<BannedUserAttributes, BannedUserCreationAttributes> = sequelize.define('bannedUser', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bannedBy: {
        type: DataTypes.STRING,
        allowNull: false
    }
});