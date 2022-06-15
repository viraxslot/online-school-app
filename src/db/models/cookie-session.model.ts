import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface CookieSessionAttributes extends DbCommonAttributes {
    username: string;
    session: string;
    expiresAt: string;
}

type CookieSessionAttributesCreationAttributes = Optional<CookieSessionAttributes, 'id'>;

export const CookieSession: ModelDefined<CookieSessionAttributes, CookieSessionAttributesCreationAttributes> =
    sequelize.define(
        'cookieSession',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            session: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
        }
    );
