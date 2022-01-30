import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { Course } from './course.model';

interface CategoryAttributes extends DbCommonAttributes {
    title: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

export const Category: ModelDefined<CategoryAttributes, CategoryCreationAttributes> = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Category.hasMany(Course, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Course.belongsTo(Category);