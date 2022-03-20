import * as bcrypt from 'bcryptjs';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { BannedUser } from './banned-user.model';
import { CreatedCourses } from './created-courses.model';
import { Course, JwtAuth, Like, Role } from './index';
import { StudentCourses } from './student-courses.model';

export enum UserRoles {
    Student = 'student',
    Teacher = 'teacher',
    Admin = 'admin',
}
export interface UserAttributes extends DbCommonAttributes {
    login: string;
    email: string;
    password: string;
    role: UserRoles | number;
    firstName?: string | null;
    lastName?: string | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

User.beforeCreate(async (user: any) => {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);
    user.password = passwordHash;

    // find and set role id
    const role: any = await Role.findOne({
        raw: true,
        where: {
            role: user.role,
        },
    });

    if (role) {
        user.role = role.id;
    }
});

User.hasMany(BannedUser, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
BannedUser.belongsTo(User);

User.hasMany(Like, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Like.belongsTo(User);

User.belongsToMany(Course, { through: StudentCourses });
Course.belongsToMany(User, { through: StudentCourses });

User.belongsToMany(Course, { through: CreatedCourses });
Course.belongsToMany(User, { through: CreatedCourses });

User.hasMany(JwtAuth, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
JwtAuth.belongsTo(User);
