 import {createLogger, format, Logger, transports} from 'winston';
import ClsUtil from './cls-util';
import Config, {LoggingConfig} from '../config/config';

const DailyRotateFile = require('winston-daily-rotate-file');

const { printf, errors, splat, timestamp } = format;

const getContextInfo = (): string => {
  const requestInfo: string = ClsUtil.getRequestInfo();

  return `${requestInfo}`;
};

const logFormat = format.combine(
    errors({ stack: true }),
    timestamp(),
    splat(),
    printf(info => {
      const { level, message, timestamp, stack } = info;
      if (stack) {
        // print log trace
        return `${timestamp} [pid-${
            process.pid
        }] ${level}: ${getContextInfo()} ${JSON.stringify(stack)}`;
      }
      return `${timestamp} [pid-${
          process.pid
      }] ${level}: ${getContextInfo()} ${message}`;
    }),
);

export let logger: Logger | undefined = undefined;

class ILogger {

  private readonly log: Logger;
  private readonly moduleName: string;

  constructor(winstonLogger: any, moduleName: string) {
    this.log = winstonLogger;
    this.moduleName = moduleName;
  }

  info(data: any, message?: any) {
    this.__log(this.moduleName, this.log.info.bind(this.log), data, message);
  }

  error(data: any, message?: any) {
    if(data && data.stack) {
      this.log.error(data.stack)
    }

    if(message && message.stack) {
      this.log.error(message.stack)
    }

    this.__log(this.moduleName, this.log.error.bind(this.log), data, message);
  }

  fatal(data: any, message: any) {
    this.__log(this.moduleName, this.log.error.bind(this.log), data, message);
  }

  private __log(moduleName: string, loggerMethod: any, data: any, message: any) {
    if (!message) {
      message = data;	// First argument is message
      data = undefined;
    }

    let dataMsg = ''
    try {
      dataMsg = data && JSON.stringify(data) || '';
    } catch (e) {
    }

    try {
      message = JSON.stringify(message)
    } catch (e) {

    }

    let msg = `[Module-${moduleName}] ${message || ''} ${dataMsg}`
    loggerMethod(msg);
  }
}

export default class LoggerUtil {
  static get(moduleName: string): ILogger {
    if(!logger) {
      logger = LoggerUtil.init(Config.getLoggingConfig());
      logger.info("Logger initialized");
    }

    const logObj = new ILogger(logger, moduleName);
    return logObj;
  }

  static init(loggingConfig: LoggingConfig): Logger {

    const matrixTransport = new DailyRotateFile({
      datePattern: 'YYYY-MM-DD_HH',
      filename: `logs/${Config.getAppName()}-%DATE%.log`,
      level: loggingConfig.LogLevel,
      maxFiles: loggingConfig.MaxAge,
      maxSize: loggingConfig.MaxSize,
      zippedArchive: false
    });

    const errorTransport = new DailyRotateFile({
      datePattern: 'YYYY-MM-DD_HH',
      filename: `logs/${Config.getAppName()}-error-%DATE%.log`,
      level: 'error',
      maxFiles: loggingConfig.MaxAge,
      maxSize: loggingConfig.MaxSize,
      zippedArchive: false
    });

    const winstonLogger = createLogger({
      format: logFormat,
      level: 'info',
      transports: [matrixTransport, errorTransport],
    });

    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      winstonLogger.add(
          new transports.Console({
            format: logFormat,
          }),
      );
    }

    return winstonLogger;
  }
}

export {ILogger};