import sequelize from '../src/db/sequelize';
import { logger } from '../src/helpers/winston-logger';

module.exports = async () => {
    logger.info('Jest global teardown');
    await sequelize.close();
};
