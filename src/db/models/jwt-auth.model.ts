import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { User } from '.';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface JwtAttributes extends DbCommonAttributes {
    jwt: string;
    ttlSeconds: number;
}

interface JwtAttributesCreationAttributes extends Optional<JwtAttributes, 'id'> {}

export const JwtAuth: ModelDefined<JwtAttributes, JwtAttributesCreationAttributes> = sequelize.define(
    'jwtAuth',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        jwt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ttlSeconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);
