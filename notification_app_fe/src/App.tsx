import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import { NotificationUiProvider, useNotificationUi } from './context/NotificationContext';
import { AppLayout } from './layouts/AppLayout';
import { NotificationsPage } from './pages/NotificationsPage';
import { PriorityInboxPage } from './pages/PriorityInboxPage';
import { logFrontend } from './services/logger';
import './styles/global.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#14532d' },
    secondary: { main: '#6d28d9' },
    warning: { main: '#b45309' },
    background: { default: '#f7f7f8' },
  },
  shape: { borderRadius: 8 },
});

const RoutedApp = () => {
  const { activePage } = useNotificationUi();

  useEffect(() => {
    void logFrontend('info', 'component', 'Frontend app mounted');
  }, []);

  return (
    <AppLayout>
      {activePage === 'priority' ? <PriorityInboxPage /> : <NotificationsPage />}
    </AppLayout>
  );
};

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <NotificationUiProvider>
      <RoutedApp />
    </NotificationUiProvider>
  </ThemeProvider>
);
