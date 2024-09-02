const fs = require('node:fs');
import { performance } from 'node:perf_hooks';
import type { FileReaderInterface, LoggerInterface, ConfigInterface } from './interfaces';

export class LogProcessor {
  constructor(
    private fileReader: FileReaderInterface,
    private logger: LoggerInterface,
    private config: ConfigInterface,
  ) {}

  async processLogFile(filePath: string, searchTerm: string): Promise<void> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Le fichier ${filePath} n'existe pas.`);
      }

      const startTime = performance.now();

      const reader = this.fileReader.read(filePath);
      const buffer: string[] = [];
      let count = 0;

      for await (const line of reader) {
        if (line.includes(searchTerm)) {
          buffer.push(line);
          count++;
        }

        if (buffer.length >= this.config.BUFFER_SIZE) {
          this.logger.info(buffer.join('\n'));
          buffer.length = 0;
        }
      }

      if (buffer.length > 0) {
        this.logger.info(buffer.join('\n'));
      }

      const endTime = performance.now();

      this.logger.info(`Nombre total de lignes contenant "${searchTerm}": ${count}`);
      this.logger.info(`Temps d'exécution: ${(endTime - startTime).toFixed(2)} millisecondes`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Erreur lors du traitement du fichier: ${error.message}`);
      } else {
        this.logger.error(`Erreur inattendue: ${error}`);
      }
    }
  }
}
