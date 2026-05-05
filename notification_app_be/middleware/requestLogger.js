const { Log } = require('../../logging_middleware/logger');

module.exports = async function requestLogger(req, _res, next) {
  await Log('backend', 'info', 'middleware', `${req.method} ${req.originalUrl}`);
  next();
};

