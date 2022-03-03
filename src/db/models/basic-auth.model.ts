import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface BasicAuthAttributes extends DbCommonAttributes {
    username: string;
    password: string;
}

type BasicAuthAttributesCreationAttributes = Optional<BasicAuthAttributes, 'id'>

export const BasicAuth: ModelDefined<BasicAuthAttributes, BasicAuthAttributesCreationAttributes> = sequelize.define(
    'basicAuth',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
    }
);
