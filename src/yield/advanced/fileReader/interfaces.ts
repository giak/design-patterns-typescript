export interface FileReaderInterface {
  read(filePath: string): AsyncGenerator<string, void, undefined>;
}

export interface LoggerInterface {
  info(message: string): void;
  error(message: string): void;
}

export interface ConfigInterface {
  SEARCH_KEYWORD: string;
  BUFFER_SIZE: number;
  DATA_FILE_NAME: string;
  LOG_FILE_PATH: string;
}
