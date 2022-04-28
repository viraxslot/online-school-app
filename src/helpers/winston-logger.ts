// import WinstonCloudWatch from 'winston-cloudwatch';
import winston, { format } from 'winston';
import config from '../../config/config';

export const logger = winston.createLogger({
    transports: []
});

const consoleFormat = format.printf(({ level, message }) => {
    return `[DEV, ${level.toUpperCase()}]: ${message}`;
});

if (config.env === 'development') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// if (config.env === 'production') {
//     const cloudwatchConfig = {
//         logGroupName: config.aws.cloudWatchLogGroup,
//         logStreamName: `backend-log-${config.env}`,
//         awsAccessKeyId: config.aws.accessKeyId,
//         awsSecretKey: config.aws.secretKeyId,
//         awsRegion: config.aws.region,
//         messageFormatter: (log: any) => `[PROD, ${log.level.toUpperCase()}]: ${log.message}`
//     };
//     logger.add(new WinstonCloudWatch(cloudwatchConfig));
// }

logger.level = process.env.LOG_LEVEL || "silly";