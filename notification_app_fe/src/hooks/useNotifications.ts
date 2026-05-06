import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import type { Notification } from '../types/notification';
import { logFrontend } from '../services/logger';

const defaultPage = 1;
const pageSize = 8;
const priorityLimit = 10;
const allTypes = 'All';

export const useNotifications = (priority = false) => {
  const [items, setItems] = useState<Notification[]>([]);
  const [page, setPage] = useState(defaultPage);
  const [type, setType] = useState(allTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const nextPage = reset ? defaultPage : page;
      const response = priority
        ? await notificationApi.priority(priorityLimit)
        : await notificationApi.list({
          page: nextPage,
          limit: pageSize,
          type: type === allTypes ? undefined : type,
        });

      setItems((current) => (reset || priority ? response.data : [...current, ...response.data]));
      if (reset) setPage(defaultPage);
      await logFrontend('info', 'hook', `Notifications fetched priority=${priority} count=${response.data.length}`);
    } catch (fetchError: any) {
      setError(fetchError?.response?.data?.message || fetchError.message || 'Unable to fetch notifications');
      await logFrontend('error', 'hook', 'Notification fetch failed');
    } finally {
      setLoading(false);
    }
  }, [page, priority, type]);

  useEffect(() => {
    void logFrontend('info', 'component', `Notifications hook mounted priority=${priority}`);
    void fetchItems(true);
  }, [priority, type]);

  const loadMore = async () => {
    setPage((value) => value + 1);
    await logFrontend('info', 'state', 'Pagination load more clicked');
  };

  useEffect(() => {
    if (!priority && page > 1) void fetchItems(false);
  }, [page]);

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  return {
    items,
    type,
    setType,
    loading,
    error,
    retry: () => fetchItems(true),
    loadMore,
    unreadCount,
  };
};
