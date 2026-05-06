import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { Notification } from '../types/notification';

const formatTime = (date: string) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(date));

export const NotificationCard = ({ notification }: { notification: Notification }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: notification.read ? 'divider' : 'primary.main' }}>
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
        <Box>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            {notification.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {notification.message}
          </Typography>
        </Box>
        <Chip
          size="small"
          icon={notification.read ? <DoneIcon /> : <PriorityHighIcon />}
          label={notification.read ? 'Read' : 'Unread'}
          color={notification.read ? 'default' : 'primary'}
        />
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={notification.type} />
        {typeof notification.score === 'number' && <Chip size="small" color="warning" label={`Score ${notification.score}`} />}
        {notification.rank && <Chip size="small" color="secondary" label={`Rank #${notification.rank}`} />}
        <Chip size="small" icon={<AccessTimeIcon />} label={formatTime(notification.createdAt)} />
      </Stack>
    </Stack>
  </Paper>
);
