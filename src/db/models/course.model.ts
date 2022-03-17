import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { Like } from '.';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { Material } from './material.model';

interface CourseAttributes extends DbCommonAttributes {
    title: string;
    description: string;
    visible: boolean;
}

type CourseCreationAttributes = Optional<CourseAttributes, 'id'>

export const Course: ModelDefined<CourseAttributes, CourseCreationAttributes> = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
});

Course.hasMany(Material, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Material.belongsTo(Course);

Course.hasMany(Like, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Like.belongsTo(Course);