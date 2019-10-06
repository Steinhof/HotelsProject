import winston, { format } from 'winston';


const { combine, timestamp, printf } = format;

const myFormat = printf(
    ({ level, message }) =>
        `${new Date().toLocaleString(
            'en-GB',
        )}  ${level.toUpperCase()} - ${message}\n`,
);

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: './logs/error.log',
            format: combine(timestamp(), myFormat),
            level: 'error',
            handleExceptions: true,
        }),
        new winston.transports.File({
            filename: './logs/combined.log',
            format: combine(timestamp(), myFormat),
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
export default logger;
