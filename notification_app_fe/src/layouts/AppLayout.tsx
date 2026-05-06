import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNotificationUi } from '../context/NotificationContext';
import { logFrontend } from '../services/logger';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { activePage, setActivePage } = useNotificationUi();

  const handleNav = (page: 'notifications' | 'priority') => {
    void logFrontend('info', 'page', `Navigation changed to ${page}`);
    setActivePage(page);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <NotificationsIcon color="primary" />
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Notification System
          </Typography>
          <Button
            startIcon={<NotificationsIcon />}
            variant={activePage === 'notifications' ? 'contained' : 'text'}
            onClick={() => handleNav('notifications')}
          >
            All
          </Button>
          <Button
            startIcon={<PriorityHighIcon />}
            variant={activePage === 'priority' ? 'contained' : 'text'}
            onClick={() => handleNav('priority')}
          >
            Priority
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
};
