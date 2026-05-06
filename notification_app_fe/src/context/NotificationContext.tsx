import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface NotificationUiContextValue {
  activePage: 'notifications' | 'priority';
  setActivePage: (page: 'notifications' | 'priority') => void;
}

const NotificationUiContext = createContext<NotificationUiContextValue | null>(null);

export const NotificationUiProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<'notifications' | 'priority'>('notifications');
  const value = useMemo(() => ({ activePage, setActivePage }), [activePage]);
  return <NotificationUiContext.Provider value={value}>{children}</NotificationUiContext.Provider>;
};

export const useNotificationUi = (): NotificationUiContextValue => {
  const value = useContext(NotificationUiContext);
  if (!value) throw new Error('useNotificationUi must be used within NotificationUiProvider');
  return value;
};
