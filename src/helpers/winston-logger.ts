import winston, { format } from 'winston';

export const logger = winston.createLogger({
    transports: [],
});

const consoleFormat = format.printf(({ level, message }) => {
    return `[App, ${level}]: ${message}`;
});

logger.add(
    new winston.transports.Console({
        format: consoleFormat,
    })
);

logger.level = process.env.LOG_LEVEL || 'silly';
