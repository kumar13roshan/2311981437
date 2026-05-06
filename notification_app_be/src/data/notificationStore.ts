import crypto from 'node:crypto';
import type { Notification } from '../types/notification';

const notifications = new Map<string, Notification>();

export const notificationStore = {
  async create(payload: Pick<Notification, 'title' | 'message' | 'type'>): Promise<Notification> {
    const notification: Notification = {
      id: crypto.randomUUID(),
      title: payload.title,
      message: payload.message,
      type: payload.type,
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifications.set(notification.id, notification);
    return notification;
  },

  async findAll(params: { page: number; limit: number; type?: string; read?: boolean; sort: 'asc' | 'desc' }) {
    let rows = Array.from(notifications.values());

    if (params.type) rows = rows.filter((item) => item.type === params.type);
    if (typeof params.read === 'boolean') rows = rows.filter((item) => item.read === params.read);

    rows.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return params.sort === 'asc' ? diff : -diff;
    });

    const total = rows.length;
    const start = (params.page - 1) * params.limit;
    return {
      rows: rows.slice(start, start + params.limit),
      total,
      page: params.page,
      limit: params.limit,
    };
  },

  async findById(id: string): Promise<Notification | null> {
    return notifications.get(id) || null;
  },

  async markAsRead(id: string): Promise<Notification | null> {
    const current = notifications.get(id);
    if (!current) return null;
    const updated = { ...current, read: true };
    notifications.set(id, updated);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    return notifications.delete(id);
  },
};
