import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface ApiKeyAttributes extends DbCommonAttributes {
    apiKey: string;
}

type ApiKeyAttributesCreationAttributes = Optional<ApiKeyAttributes, 'id'>;

export const ApiKey: ModelDefined<ApiKeyAttributes, ApiKeyAttributesCreationAttributes> = sequelize.define('apiKey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    apiKey: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});
