const seedNotifications = [
  {
    id: 'n-1001',
    studentId: 1042,
    type: 'Placement',
    message: 'Google hiring drive announced for final year students.',
    isRead: false,
    createdAt: '2026-05-05T05:30:00.000Z',
  },
  {
    id: 'n-1002',
    studentId: 1042,
    type: 'Result',
    message: 'Semester 6 results are now available.',
    isRead: false,
    createdAt: '2026-05-04T14:00:00.000Z',
  },
  {
    id: 'n-1003',
    studentId: 1042,
    type: 'Event',
    message: 'Tech Fest registration closes tonight.',
    isRead: true,
    createdAt: '2026-05-03T09:15:00.000Z',
  },
  {
    id: 'n-1004',
    studentId: 1042,
    type: 'Placement',
    message: 'Infosys pre-placement talk starts tomorrow morning.',
    isRead: false,
    createdAt: '2026-05-02T10:20:00.000Z',
  },
  {
    id: 'n-1005',
    studentId: 1042,
    type: 'Event',
    message: 'Resume building workshop starts at 2 PM.',
    isRead: false,
    createdAt: '2026-05-01T08:45:00.000Z',
  },
];

let notifications = [...seedNotifications];

function findAll({ studentId, page = 1, limit = 10, type }) {
  const filtered = notifications
    .filter((notification) => notification.studentId === Number(studentId))
    .filter((notification) => !type || notification.type === type)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const start = (Number(page) - 1) * Number(limit);

  return {
    notifications: filtered.slice(start, start + Number(limit)),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: filtered.length,
    },
  };
}

function create({ studentId, type, message }) {
  const notification = {
    id: `n-${Date.now()}`,
    studentId: Number(studentId),
    type,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  notifications.unshift(notification);
  return notification;
}

function markAsRead(id) {
  const index = notifications.findIndex((notification) => notification.id === id);
  if (index === -1) return null;

  notifications[index] = { ...notifications[index], isRead: true };
  return notifications[index];
}

function findByStudent(studentId) {
  return notifications.filter((notification) => notification.studentId === Number(studentId));
}

module.exports = {
  findAll,
  create,
  markAsRead,
  findByStudent,
};

