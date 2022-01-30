import { Dialect, Sequelize } from 'sequelize';

export class DbInstance {
    readonly sequelize: Sequelize;

    constructor(options?: { host: string; db: string; username: string; password: string; dialect?: string }) {
        const host = options?.host ?? process.env.POSTGRES_HOST;
        const database = options?.db ?? (process.env.POSTGRES_DB as string);
        const username = options?.username ?? (process.env.POSTGRES_USER as string);
        const password = options?.password ?? (process.env.POSTGRES_PASSWORD as string);
        const dialect = (options?.dialect ?? 'postgres') as Dialect;

        this.sequelize = new Sequelize(database, username, password, { host, dialect });
    }
}

const db = new DbInstance();
const sequelize = db.sequelize;

export default sequelize;
