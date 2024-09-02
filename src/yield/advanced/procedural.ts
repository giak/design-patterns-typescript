const fs = require('node:fs');
const readline = require('node:readline');
const { performance } = require('node:perf_hooks');
import { createLogger, format, transports } from 'winston';

const CONFIG = {
  SEARCH_KEYWORD: 'ERROR',
  BUFFER_SIZE: 1000,
  DATA_FILE_NAME: 'largeLogFile.txt',
  LOG_FILE_PATH: `${__dirname}/largeLogFile.log`,
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
  ),
  transports: [new transports.Console(), new transports.File({ filename: CONFIG.LOG_FILE_PATH })],
});

async function* readLargeFile(filePath: string): AsyncGenerator<string, void, undefined> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  for await (const line of rl) {
    yield line;
  }
}

async function processLogFile(filePath: string, searchTerm: string) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Le fichier ${filePath} n'existe pas.`);
    }

    const startTime = performance.now();

    const reader = readLargeFile(filePath);
    const buffer = [];
    let count = 0;

    for await (const line of reader) {
      if (line.includes(searchTerm)) {
        buffer.push(line);
        count++;
      }

      if (buffer.length >= CONFIG.BUFFER_SIZE) {
        // Traite ou écrit le buffer quelque part
        logger.info(buffer.join('\n'));
        buffer.length = 0; // Réinitialise le buffer
      }
    }

    // Traite le reste du buffer
    if (buffer.length > 0) {
      logger.info(buffer.join('\n'));
    }

    const endTime = performance.now();

    logger.info(`Nombre total de lignes contenant "${searchTerm}": ${count}`);
    logger.info(`Temps d'exécution: ${(endTime - startTime).toFixed(2)} millisecondes`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Erreur lors du traitement du fichier: ${error.message}`);
    } else {
      logger.error(`Erreur inattendue: ${error}`);
    }
  }
}

// Appel de la fonction avec le fichier de logs et le mot-clé recherché
processLogFile(CONFIG.DATA_FILE_NAME, CONFIG.SEARCH_KEYWORD);
