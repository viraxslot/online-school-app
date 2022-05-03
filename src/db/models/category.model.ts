import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { Course } from './course.model';

interface CategoryAttributes extends DbCommonAttributes {
    title: string;
    createdBy: string;
    updatedBy: string | null;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id'>;

export const Category: ModelDefined<CategoryAttributes, CategoryCreationAttributes> = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false
    },
    updatedBy: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    }
});

Category.hasMany(Course, { onUpdate: 'CASCADE' });
Course.belongsTo(Category);