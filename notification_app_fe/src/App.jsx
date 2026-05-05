import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import { Log } from './services/logger';

export default function App() {
  const [pageName, setPageName] = useState('all');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const studentId = 1042;

  useEffect(() => {
    Log('frontend', 'info', 'page', `page changed to ${pageName}`);
  }, [pageName]);

  return (
    <Box minHeight="100vh">
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            Notification Platform
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              variant={pageName === 'all' ? 'outlined' : 'text'}
              onClick={() => setPageName('all')}
            >
              All Notifications
            </Button>
            <Button
              color="inherit"
              variant={pageName === 'priority' ? 'outlined' : 'text'}
              onClick={() => setPageName('priority')}
            >
              Priority Inbox
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {pageName === 'all' ? (
        <AllNotifications
          studentId={studentId}
          page={page}
          setPage={setPage}
          type={type}
          setType={setType}
        />
      ) : (
        <PriorityInbox studentId={studentId} />
      )}
    </Box>
  );
}
