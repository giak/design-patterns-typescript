import fs from 'node:fs';
import readline from 'node:readline';
import { performance } from 'node:perf_hooks';
import { createLogger, format, transports, Logger } from 'winston';

// Configuration
interface Config {
  readonly SEARCH_KEYWORD: string;
  readonly BUFFER_SIZE: number;
  readonly DATA_FILE_NAME: string;
  readonly LOG_FILE_PATH: string;
}

const CONFIG: Config = {
  SEARCH_KEYWORD: 'ERROR',
  BUFFER_SIZE: 1000,
  DATA_FILE_NAME: 'largeLogFile.txt',
  LOG_FILE_PATH: `${__dirname}/largeLogFile.log`,
};

// Logger Factory
class LoggerFactory {
  static createLogger(): Logger {
    return createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
      ),
      transports: [new transports.Console(), new transports.File({ filename: CONFIG.LOG_FILE_PATH })],
    });
  }
}

// File Reader
class FileReader {
  static async *readLargeFile(filePath: string): AsyncGenerator<string, void, undefined> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Number.POSITIVE_INFINITY,
    });

    for await (const line of rl) {
      yield line;
    }
  }
}

// Log Processor
class LogProcessor {
  private logger: Logger;
  private buffer: string[] = [];
  private count = 0;

  constructor(private config: Config) {
    this.logger = LoggerFactory.createLogger();
  }

  async processLogFile(filePath: string, searchTerm: string): Promise<void> {
    try {
      this.validateFile(filePath);
      const startTime = performance.now();

      await this.processLines(filePath, searchTerm);
      this.flushBuffer();

      const endTime = performance.now();
      this.logResults(searchTerm, startTime, endTime);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private validateFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Le fichier ${filePath} n'existe pas.`);
    }
  }

  private async processLines(filePath: string, searchTerm: string): Promise<void> {
    const reader = FileReader.readLargeFile(filePath);
    for await (const line of reader) {
      if (line.includes(searchTerm)) {
        this.buffer.push(line);
        this.count++;
      }
      this.checkBufferSize();
    }
  }

  private checkBufferSize(): void {
    if (this.buffer.length >= this.config.BUFFER_SIZE) {
      this.flushBuffer();
    }
  }

  private flushBuffer(): void {
    if (this.buffer.length > 0) {
      this.logger.info(this.buffer.join('\n'));
      this.buffer = [];
    }
  }

  private logResults(searchTerm: string, startTime: number, endTime: number): void {
    this.logger.info(`Nombre total de lignes contenant "${searchTerm}": ${this.count}`);
    this.logger.info(`Temps d'exécution: ${(endTime - startTime).toFixed(2)} millisecondes`);
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      this.logger.error(`Erreur lors du traitement du fichier: ${error.message}`);
    } else {
      this.logger.error(`Erreur inattendue: ${error}`);
    }
  }
}

// Main function
async function main() {
  const processor = new LogProcessor(CONFIG);
  await processor.processLogFile(CONFIG.DATA_FILE_NAME, CONFIG.SEARCH_KEYWORD);
}

main().catch(console.error);
