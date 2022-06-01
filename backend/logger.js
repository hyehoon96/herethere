const { createLogger, format, transports } = require('winston');
const winstonDaily = require('winston-daily-rotate-file');


const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new winstonDaily({  //매일 새로운 파일에 로그를 기록하도록 설정
      filename: 'combined.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: 2,
      dirname: 'logs',
      maxSize: '10k'
    }),
    new winstonDaily({ 
      filename: 'error.log', 
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: 2,
      dirname: 'logs',
      maxSize: '10k'
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;