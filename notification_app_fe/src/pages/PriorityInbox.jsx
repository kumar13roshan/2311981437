import React from 'react';
import { Container, Stack, Typography } from '@mui/material';
import NotificationList from '../components/NotificationList';

export default function PriorityInbox({ studentId }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1} mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Priority Inbox
        </Typography>
        <Typography color="text.secondary">
          Sorted by Placement, Result, Event, then latest timestamp. Showing top 10.
        </Typography>
      </Stack>

      <NotificationList
        studentId={studentId}
        page={1}
        setPage={() => {}}
        type=""
        setType={() => {}}
        priority
      />
    </Container>
  );
}
