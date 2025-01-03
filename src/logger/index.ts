import winston, { LoggerOptions } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

//  Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    kafka: 7, // Custom 'kafka' level
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey',
    kafka: 'orange', // Assign a color to the 'kafka' level
  },
};

var infoTransport: DailyRotateFile = new DailyRotateFile({
  level: 'info',
  filename: 'ALL-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: 'logs',
});

var errorTransport = new DailyRotateFile({
  level: 'error',
  filename: 'ERROR-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: 'logs',
});

var kafkaTransport = new DailyRotateFile({
  level: 'kafka',
  filename: 'KAFKA-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: 'logs',
  // Add a filter for kafka level onlu
  format: winston.format((info) => (info.level === 'kafka' ? info : false))(),
});

const loggerOption: LoggerOptions = {
  levels: customLevels.levels,
  level: 'info',
  format: winston.format.json(),
  transports: [infoTransport, errorTransport, kafkaTransport],
};

const logger = winston.createLogger(loggerOption);
// Add colorization for console logs
winston.addColors(customLevels.colors);

if (process.env.environment !== 'prod') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

export { logger };
