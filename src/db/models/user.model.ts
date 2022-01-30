import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { Course, Like } from '.';
import { DbCommonAttributes } from '../interfaces/common.db';
import sequelize from '../sequelize';
import { BannedUser } from './banned-user.model';

interface UserAttributes extends DbCommonAttributes {
    nickname: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    passwordHash: string;
    roleId: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
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
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasMany(BannedUser, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
BannedUser.belongsTo(User);

User.hasMany(Like, { onUpdate: 'CASCADE', onDelete: 'CASCADE' });
Like.belongsTo(User);

User.belongsToMany(Course, { through: 'UserCourses' });
Course.belongsToMany(User, { through: 'UserCourses' });
