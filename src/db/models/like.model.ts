import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

export enum LikeValue {
    Yes = 'yes',
    No = 'no',
    Remove = 'remove'
}

interface LikeAttributes extends DbCommonAttributes {
    userId: number;
    courseId: number;
    like: LikeValue;
}

type LikeCreationAttributes = Optional<LikeAttributes, 'id'>;

export const Like: ModelDefined<LikeAttributes, LikeCreationAttributes> = sequelize.define('like', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    like: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
