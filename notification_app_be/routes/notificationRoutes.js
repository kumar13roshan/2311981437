const express = require('express');
const notificationController = require('../controllers/notificationController');
const { Log } = require('../../logging_middleware/logger');

const router = express.Router();

router.use(async (_req, _res, next) => {
  await Log('backend', 'debug', 'route', 'notification route reached');
  next();
});

router.get('/priority', notificationController.getPriorityInbox);
router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;

