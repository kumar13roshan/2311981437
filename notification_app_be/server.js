const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { Log } = require('../logging_middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', async (_req, res) => {
  await Log('backend', 'info', 'route', 'health check requested');
  res.status(200).json({ success: true, message: 'Notification API is running' });
});

app.use('/notifications', notificationRoutes);
app.use(errorHandler);

app.listen(PORT, async () => {
  await Log('backend', 'info', 'config', `backend server started on port ${PORT}`);
  console.log(`Notification API running at http://localhost:${PORT}`);
});

