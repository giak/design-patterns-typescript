const fs = require('node:fs');

const CONFIG = {
  LOG_DATA_INFO: 'INFO',
  LOG_DATA_ERROR: 'ERROR',
  LOG_FILE_NAME: 'logFile.txt',
  LOG_FILE_LINE_LENGTH: 1000000,
};

const generateLogFile = (fileName: string, numLines: number) => {
  const writeStream = fs.createWriteStream(fileName);
  for (let i = 0; i < numLines; i++) {
    const logType = i % 1000 === 0 ? CONFIG.LOG_DATA_ERROR : CONFIG.LOG_DATA_INFO;
    writeStream.write(`${logType} - This is log entry number ${i + 1}\n`);
  }
  writeStream.end();
  console.log(`${fileName} created with ${numLines} lines.`);
};

generateLogFile(`${__dirname}/${CONFIG.LOG_FILE_NAME}`, CONFIG.LOG_FILE_LINE_LENGTH);

export type {};
