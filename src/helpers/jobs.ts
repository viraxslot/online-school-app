import cron from 'cron';
import { Op } from 'sequelize';
import appConfig from '../../config/app-config';
import { JwtAuth } from '../db/models';
import { logger } from './winston-logger';

let oldTokensJobSchedule = '0 */30 * * * *';

if (appConfig.env === 'production') {
    oldTokensJobSchedule = '00 00 00 * * *';
}

const removeOldTokens = new cron.CronJob(
    oldTokensJobSchedule,
    async function () {
        const jobName = 'Remove outdated tokens';
        logger.info(`${jobName}: start`);

        try {
            const expireHours = parseInt(appConfig.jwtExpiresIn.replace('h', ''));
            const currentDate = new Date();
            const result = await JwtAuth.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: currentDate.setHours(currentDate.getHours() - expireHours),
                    },
                },
            });
            logger.info(`${jobName}: removed ${result.toString()} records`);
        } catch (err) {
            logger.error(`${jobName}: unable to remove old tokens ${JSON.stringify(err)}`);
        }

        logger.info(`${jobName}: end`);
    },
    null
);

removeOldTokens.start();
