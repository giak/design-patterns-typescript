import { CONFIG } from './config';
import { logger } from './logger';
import { FileReader } from './fileReader';
import { LogProcessor } from './logProcessor';

const fileReader = new FileReader();
const logProcessor = new LogProcessor(fileReader, logger, CONFIG);

logProcessor.processLogFile(CONFIG.LOG_FILE_PATH, CONFIG.SEARCH_KEYWORD);
