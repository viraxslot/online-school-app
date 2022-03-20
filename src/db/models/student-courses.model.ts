import { DataTypes, ModelDefined } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';

export interface StudentCoursesAttributes extends DbCommonAttributes {
    userId: number;
    courseId: number;
}
export const StudentCourses: ModelDefined<StudentCoursesAttributes, StudentCoursesAttributes> = sequelize.define(
    'StudentCourses',
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
