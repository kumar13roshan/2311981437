import { notificationService } from '../services/notificationService';
import { priorityInboxService } from '../services/priorityInboxService';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

const defaultPriorityLimit = 10;

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.create(req.body);
  return successResponse(res, 201, 'Notification created successfully', notification);
});

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.list(req.query);
  return successResponse(res, 200, 'Notifications fetched successfully', result.rows, {
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(String(req.params.id));
  return successResponse(res, 200, 'Notification marked as read', notification);
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.remove(String(req.params.id));
  return successResponse(res, 200, 'Notification deleted successfully');
});

export const getPriorityInbox = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || defaultPriorityLimit);
  const notifications = await priorityInboxService.fetchPriorityInbox(limit);
  return successResponse(res, 200, 'Priority inbox fetched successfully', notifications, {
    count: notifications.length,
    algorithm: 'min-heap O(n log k)',
  });
});
