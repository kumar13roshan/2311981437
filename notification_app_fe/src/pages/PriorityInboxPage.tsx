import { Box, Button, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { NotificationList } from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';

export const PriorityInboxPage = () => {
  const { items, loading, error, retry } = useNotifications(true);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Priority Inbox</Typography>
        <Typography color="text.secondary">Top unread notifications scored by type weight and recency.</Typography>
      </Box>
      <Button startIcon={<RefreshIcon />} variant="outlined" onClick={retry} sx={{ alignSelf: 'flex-start' }}>
        Refresh priority inbox
      </Button>
      <NotificationList items={items} loading={loading} error={error} retry={retry} />
    </Stack>
  );
};
