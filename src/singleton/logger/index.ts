enum LogLevel {
  INFO,
  ERROR,
  WARNING,
}

class Logger {
  private static instance: Logger;
  private loggingEnabled: boolean;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.loggingEnabled = true;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public static enableLogging(isEnabled: boolean) {
    let logger = Logger.getInstance();
    logger.loggingEnabled = isEnabled;
  }

  public log(level: LogLevel, message: string): void {
    console.log(`[${LogLevel[level]}] ${message}`);
  }
}

// Usage:
const logger1 = Logger.getInstance();
logger1.log(LogLevel.INFO, 'Application started');

const logger2 = Logger.getInstance();
logger2.log(LogLevel.ERROR, 'An error occurred');

console.log(logger1 === logger2);
