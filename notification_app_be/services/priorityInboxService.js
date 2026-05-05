const axios = require('axios');
const notificationRepository = require('../repositories/notificationRepository');
const { Log } = require('../../logging_middleware/logger');

const REMOTE_NOTIFICATION_API =
  process.env.NOTIFICATION_API_URL || 'http://20.207.122.201/evaluation-service/notifications';

const priorityRank = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function normalizeNotification(notification) {
  return {
    id: notification.id || notification.ID,
    type: notification.type || notification.Type,
    message: notification.message || notification.Message,
    createdAt: notification.createdAt || notification.Timestamp,
    isRead: Boolean(notification.isRead),
    studentId: notification.studentId,
  };
}

function sortPriorityInbox(notifications) {
  return notifications
    .map(normalizeNotification)
    .filter((notification) => priorityRank[notification.type])
    .sort((a, b) => {
      const priorityDifference = priorityRank[b.type] - priorityRank[a.type];
      if (priorityDifference !== 0) return priorityDifference;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 10);
}

async function fetchRemoteNotifications(studentId) {
  const response = await axios.get(REMOTE_NOTIFICATION_API, {
    params: { studentId },
    headers: process.env.EVALUATION_ACCESS_TOKEN
      ? { Authorization: `Bearer ${process.env.EVALUATION_ACCESS_TOKEN}` }
      : {},
    timeout: 10000,
  });

  return response.data.notifications || [];
}

async function getPriorityInbox(studentId) {
  await Log('backend', 'info', 'service', `priority inbox requested for student ${studentId}`);

  try {
    const remoteNotifications = await fetchRemoteNotifications(studentId);
    return sortPriorityInbox(remoteNotifications);
  } catch (error) {
    await Log('backend', 'warn', 'service', `remote priority fetch failed: ${error.message}`);
    return sortPriorityInbox(notificationRepository.findByStudent(studentId));
  }
}

module.exports = {
  getPriorityInbox,
  sortPriorityInbox,
};

