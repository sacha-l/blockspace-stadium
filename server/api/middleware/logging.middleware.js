import chalk from 'chalk';

const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return chalk.red;
  if (statusCode >= 400) return chalk.yellow;
  if (statusCode >= 300) return chalk.cyan;
  if (statusCode >= 200) return chalk.green;
  return chalk.white;
};

const requestLogger = (req, res, next) => {
  const start = process.hrtime();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    const statusColor = getStatusColor(res.statusCode);
    const method = chalk.bold(req.method);
    
    console.log(
      `[${chalk.gray(timestamp)}] ${statusColor(res.statusCode)} ${method} ${chalk.underline(req.originalUrl)} - ${chalk.magenta(duration + 'ms')}`
    );
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      const diff = process.hrtime(start);
      const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
      console.log(
        `[${chalk.gray(timestamp)}] ${chalk.yellow('REQUEST_ABORTED')} ${chalk.bold(req.method)} ${chalk.underline(req.originalUrl)} - after ${chalk.magenta(duration + 'ms')}`
      );
    }
  });

  next();
};

export default requestLogger;