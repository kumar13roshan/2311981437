import React from 'react';
import { Container, Stack, Typography } from '@mui/material';
import NotificationList from '../components/NotificationList';

export default function AllNotifications({ studentId, page, setPage, type, setType }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1} mb={4}>
        <Typography variant="h4" fontWeight={800}>
          All Notifications
        </Typography>
        <Typography color="text.secondary">Student ID: {studentId}</Typography>
      </Stack>

      <NotificationList
        studentId={studentId}
        page={page}
        setPage={setPage}
        type={type}
        setType={setType}
      />
    </Container>
  );
}
