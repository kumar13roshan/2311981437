import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Button, Skeleton, Stack } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import type { Notification } from '../types/notification';
import { logFrontend } from '../services/logger';

export const NotificationList = ({
  items,
  loading,
  error,
  retry,
}: {
  items: Notification[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}) => {
  if (error) {
    return (
      <Alert
        severity="error"
        action={(
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => {
              void logFrontend('warn', 'component', 'Retry button clicked');
              retry();
            }}
          >
            Retry
          </Button>
        )}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((notification) => <NotificationCard key={notification.id} notification={notification} />)}
      {loading && Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={120} />
      ))}
      {!loading && items.length === 0 && <Alert severity="info">No notifications found for the selected view.</Alert>}
    </Stack>
  );
};
