import { DataTypes, ModelDefined } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

export interface CreatedCoursesAttributes extends DbCommonAttributes {
    userId: number;
    courseId: number;
}
export const CreatedCourses: ModelDefined<CreatedCoursesAttributes, CreatedCoursesAttributes> = sequelize.define(
    'CreatedCourses',
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
        },
        courseId: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
        },
    }
);
