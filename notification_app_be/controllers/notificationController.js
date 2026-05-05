const notificationService = require('../services/notificationService');
const priorityInboxService = require('../services/priorityInboxService');
const { Log } = require('../../logging_middleware/logger');

async function getNotifications(req, res, next) {
  try {
    await Log('backend', 'info', 'controller', 'GET /notifications controller started');
    const data = await notificationService.getNotifications(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function createNotification(req, res, next) {
  try {
    await Log('backend', 'info', 'controller', 'POST /notifications controller started');
    const data = await notificationService.createNotification(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    await Log('backend', 'info', 'controller', 'PATCH /notifications/:id/read controller started');
    const data = await notificationService.markNotificationAsRead(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function getPriorityInbox(req, res, next) {
  try {
    const studentId = req.query.studentId || 1042;
    const notifications = await priorityInboxService.getPriorityInbox(studentId);
    res.status(200).json({ notifications });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  getPriorityInbox,
};

