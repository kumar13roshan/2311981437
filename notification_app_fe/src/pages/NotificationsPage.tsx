import AddIcon from '@mui/icons-material/Add';
import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes';
import { NotificationList } from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import { notificationApi } from '../api/notificationApi';
import { logFrontend } from '../services/logger';

export const NotificationsPage = () => {
  const { items, type, setType, loading, error, retry, loadMore, unreadCount } = useNotifications(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [newType, setNewType] = useState('Placement');

  const createNotification = async () => {
    await notificationApi.create({ title, message, type: newType });
    await logFrontend('info', 'component', 'Create notification action completed');
    setTitle('');
    setMessage('');
    retry();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Notifications</Typography>
        <Typography color="text.secondary">Unread: {unreadCount}</Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} fullWidth />
          <TextField label="Message" value={message} onChange={(event) => setMessage(event.target.value)} fullWidth />
          <TextField select label="Type" value={newType} onChange={(event) => setNewType(event.target.value)} sx={{ minWidth: 150 }}>
            {NOTIFICATION_TYPES.filter((item) => item !== 'All').map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
          <Button startIcon={<AddIcon />} variant="contained" onClick={createNotification} disabled={!title || !message}>
            Create
          </Button>
        </Stack>
      </Paper>

      <TextField
        select
        label="Filter by type"
        value={type}
        onChange={(event) => {
          void logFrontend('info', 'state', `Filter changed to ${event.target.value}`);
          setType(event.target.value);
        }}
        sx={{ maxWidth: 240 }}
      >
        {NOTIFICATION_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
      </TextField>

      <NotificationList items={items} loading={loading} error={error} retry={retry} />
      <Button variant="outlined" onClick={loadMore} disabled={loading}>Load more</Button>
    </Stack>
  );
};
