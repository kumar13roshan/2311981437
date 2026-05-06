import { Log } from 'affordmed-logging-middleware';
import { notificationStore } from '../data/notificationStore';
import { validateCreateNotification, validatePagination } from '../validators/notificationValidator';
import { AppError } from '../utils/AppError';

export const notificationService = {
  async create(body: unknown) {
    try {
      const payload = validateCreateNotification(body);
      const notification = await notificationStore.create(payload);
      await Log('backend', 'info', 'service', `Created notification id=${notification.id}`);
      return notification;
    } catch (error: any) {
      await Log('backend', 'warn', 'service', `Create notification validation/API failure: ${error.message}`);
      throw error;
    }
  },

  async list(query: unknown) {
    const params = validatePagination(query);
    const result = await notificationStore.findAll(params);
    await Log('backend', 'info', 'service', `Fetched notifications total=${result.total}`);
    return result;
  },

  async markRead(id: string) {
    const notification = await notificationStore.markAsRead(id);
    if (!notification) throw new AppError('Notification not found', 404);
    await Log('backend', 'info', 'service', `Marked notification read id=${id}`);
    return notification;
  },

  async remove(id: string) {
    const deleted = await notificationStore.delete(id);
    if (!deleted) throw new AppError('Notification not found', 404);
    await Log('backend', 'info', 'service', `Deleted notification id=${id}`);
  },
};
