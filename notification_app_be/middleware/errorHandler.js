const { Log } = require('../../logging_middleware/logger');

module.exports = async function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  await Log('backend', statusCode >= 500 ? 'error' : 'warn', 'handler', error.message);

  res.status(statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
  });
};

