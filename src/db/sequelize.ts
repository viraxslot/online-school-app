import { Dialect, Sequelize } from 'sequelize';
import config from '../../config/config';

export class DbInstance {
    readonly sequelize: Sequelize;

    constructor(options?: { host: string; db: string; username: string; password: string; dialect?: string; }) {
        const host = options?.host ?? config.host;
        const database = options?.db ?? config.database;
        const username = options?.username ?? config.username;
        const password = options?.password ?? config.password;
        const dialect = (options?.dialect ?? config.dialect) as Dialect;

        this.sequelize = new Sequelize(database, username, password, { host, dialect, logging: false });
    }
}

const db = new DbInstance();
const sequelize = db.sequelize;

export default sequelize;
