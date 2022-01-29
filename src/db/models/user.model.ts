import { DataTypes } from 'sequelize';
import { DbUserInstance } from '../interfaces/user.db';
import sequelize from '../sequelize';

export const UserModel = sequelize.define<DbUserInstance>('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
});
