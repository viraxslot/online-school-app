import { Optional, Model } from 'sequelize';
import { DbCommonColumns } from './common.db';

export interface DbUserAttributes extends DbCommonColumns {
    firstName: string;
    lastName: string;
}

export interface DbUserCreationAttributes extends Optional<DbUserAttributes, 'id'> {}

export interface DbUserInstance extends Model<DbUserAttributes, DbUserCreationAttributes>, DbUserAttributes {}
