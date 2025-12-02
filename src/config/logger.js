import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ), // ✅ FIXED: missing comma

  defaultMeta: { service: 'acquisitions-api' },

  transports: [
    // Write all logs with level `error` or higher to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

    // Write all logs with level `info` or higher to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If not production, log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
