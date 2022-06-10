import { Dialect, Sequelize } from 'sequelize';
import appConfig from '../../config/app-config';

export class DbInstance {
    readonly sequelize: Sequelize;

    constructor(options?: { host: string; db: string; username: string; password: string; dialect?: string }) {
        const host = options?.host ?? appConfig.host;
        const database = options?.db ?? appConfig.database;
        const username = options?.username ?? appConfig.username;
        const password = options?.password ?? appConfig.password;
        const dialect = (options?.dialect ?? appConfig.dialect) as Dialect;

        this.sequelize = new Sequelize(database, username, password, { host, dialect, logging: false });
    }
}

const db = new DbInstance();
const sequelize = db.sequelize;

export default sequelize;
