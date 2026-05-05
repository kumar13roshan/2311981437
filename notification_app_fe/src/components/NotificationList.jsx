import React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationList({
  studentId,
  page,
  setPage,
  type,
  setType,
  priority = false,
}) {
  const limit = 10;
  const { notifications, pagination, loading, error, markAsRead } = useNotifications({
    studentId,
    page,
    limit,
    type,
    priority,
  });

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / limit));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {!priority && (
        <FormControl fullWidth size="small">
          <InputLabel>Filter by type</InputLabel>
          <Select
            value={type}
            label="Filter by type"
            onChange={(event) => {
              setType(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            priority={priority || notification.type === 'Placement'}
            onMarkAsRead={markAsRead}
          />
        ))}
      </Stack>

      {notifications.length === 0 && (
        <Typography textAlign="center" color="text.secondary" py={6}>
          No notifications found
        </Typography>
      )}

      {!priority && totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} />
        </Box>
      )}
    </Stack>
  );
}
