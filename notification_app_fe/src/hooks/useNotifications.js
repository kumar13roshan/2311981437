import { useCallback, useEffect, useState } from 'react';
import {
  getNotifications,
  getPriorityNotifications,
  markNotificationAsRead,
} from '../services/notificationApi';
import { Log } from '../services/logger';

export function useNotifications({ studentId, page, limit, type, priority = false }) {
  const [data, setData] = useState({ notifications: [], pagination: { page, limit, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (priority) {
        const notifications = await getPriorityNotifications(studentId);
        setData({ notifications, pagination: { page: 1, limit: 10, total: notifications.length } });
      } else {
        setData(await getNotifications({ studentId, page, limit, type }));
      }
    } catch (requestError) {
      setError('Unable to load notifications');
      await Log('frontend', 'error', 'hook', requestError.message);
    } finally {
      setLoading(false);
    }
  }, [studentId, page, limit, type, priority]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    await markNotificationAsRead(id);
    await loadNotifications();
  };

  return {
    notifications: data.notifications,
    pagination: data.pagination,
    loading,
    error,
    markAsRead,
    reload: loadNotifications,
  };
}

