import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

interface MaterialAttributes extends DbCommonAttributes {
    title: string;
    data: string;
    order: number | null;
    courseId: number;
    createdBy?: string;
    updatedBy?: string | null;
}

type MaterialCreationAttributes = Optional<MaterialAttributes, 'id'>;

export const Material: ModelDefined<MaterialAttributes, MaterialCreationAttributes> = sequelize.define('material', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
