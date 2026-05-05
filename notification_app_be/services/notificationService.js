const notificationRepository = require('../repositories/notificationRepository');
const AppError = require('../utils/AppError');
const { Log } = require('../../logging_middleware/logger');

const VALID_TYPES = new Set(['Event', 'Result', 'Placement']);

function validateListQuery({ studentId, page, limit, type }) {
  if (!studentId) throw new AppError('studentId is required', 400);
  if (Number.isNaN(Number(studentId))) throw new AppError('studentId must be a number', 400);
  if (page && Number(page) < 1) throw new AppError('page must be greater than 0', 400);
  if (limit && (Number(limit) < 1 || Number(limit) > 100)) {
    throw new AppError('limit must be between 1 and 100', 400);
  }
  if (type && !VALID_TYPES.has(type)) {
    throw new AppError('type must be Event, Result, or Placement', 400);
  }
}

async function getNotifications(query) {
  validateListQuery(query);
  await Log('backend', 'info', 'service', `fetch notifications for student ${query.studentId}`);

  return notificationRepository.findAll({
    studentId: query.studentId,
    page: query.page || 1,
    limit: query.limit || 10,
    type: query.type,
  });
}

async function createNotification(payload) {
  const { studentId, type, message } = payload;

  if (!studentId) throw new AppError('studentId is required', 400);
  if (!VALID_TYPES.has(type)) throw new AppError('type must be Event, Result, or Placement', 400);
  if (!message || typeof message !== 'string') throw new AppError('message is required', 400);

  const notification = notificationRepository.create({ studentId, type, message });
  await Log('backend', 'info', 'service', `notification created with id ${notification.id}`);

  return {
    success: true,
    notificationId: notification.id,
  };
}

async function markNotificationAsRead(id) {
  const notification = notificationRepository.markAsRead(id);
  if (!notification) throw new AppError('notification not found', 404);

  await Log('backend', 'info', 'service', `notification marked as read: ${id}`);
  return {
    success: true,
    message: 'Notification marked as read',
  };
}

module.exports = {
  getNotifications,
  createNotification,
  markNotificationAsRead,
};

