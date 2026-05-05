import React from 'react';
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { Log } from '../services/logger';

const priorityColor = {
  Placement: '#059669',
  Result: '#d97706',
  Event: '#2563eb',
};

export default function NotificationItem({ notification, onMarkAsRead, priority }) {
  const isUnread = !notification.isRead;

  const handleMarkAsRead = async () => {
    await Log('frontend', 'info', 'component', `mark notification read: ${notification.id}`);
    onMarkAsRead(notification.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: priority ? priorityColor[notification.type] : 'divider',
        borderLeft: `6px solid ${priorityColor[notification.type]}`,
        backgroundColor: isUnread ? '#ffffff' : '#f1f5f9',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={notification.type}
                size="small"
                sx={{
                  color: '#ffffff',
                  backgroundColor: priorityColor[notification.type],
                  fontWeight: 700,
                }}
              />
              {priority && <Chip label="Priority" color="success" size="small" variant="outlined" />}
              {isUnread ? (
                <Chip label="Unread" size="small" color="primary" variant="outlined" />
              ) : (
                <Chip label="Read" size="small" variant="outlined" />
              )}
            </Stack>
            <Typography fontWeight={isUnread ? 700 : 500}>{notification.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Stack>

          <Tooltip title={isUnread ? 'Mark as read' : 'Already read'}>
            <span>
              <IconButton
                size="small"
                color={isUnread ? 'primary' : 'default'}
                disabled={!isUnread}
                onClick={handleMarkAsRead}
              >
                {isUnread ? <VisibilityIcon /> : <DoneIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
