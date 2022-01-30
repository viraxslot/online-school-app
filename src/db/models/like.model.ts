import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface LikeAttributes extends DbCommonAttributes {
    title: string;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

export const Like: ModelDefined<LikeAttributes, LikeCreationAttributes> = sequelize.define('like', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});
