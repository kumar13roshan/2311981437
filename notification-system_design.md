# Notification System Design

## Stage 1 - API Design

Base URL:

```text
/notifications
```

Production services can expose this behind:

```text
/api/v1/notifications
```

### GET /notifications

Query params:

- `studentId` required
- `page` default `1`
- `limit` default `10`
- `type` optional: `Event`, `Result`, `Placement`

Response JSON:

```json
{
  "notifications": [
    {
      "id": "uuid",
      "studentId": 1042,
      "type": "Event",
      "message": "Tech Fest happening tomorrow",
      "isRead": false,
      "createdAt": "2026-04-22T17:51:30Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### POST /notifications

Request JSON:

```json
{
  "studentId": 1042,
  "type": "Placement",
  "message": "Google hiring drive announced"
}
```

Response JSON:

```json
{
  "success": true,
  "notificationId": "uuid"
}
```

### PATCH /notifications/:id/read

Response JSON:

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

Headers:

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

Main app APIs can run without authentication for this evaluation. Protected evaluation APIs use the bearer token from the auth endpoint.

Error handling:

```json
{
  "success": false,
  "error": "Invalid studentId"
}
```

Real-time updates:

- Use WebSockets for new notifications.
- Server publishes `new_notification`.
- Clients subscribe by `studentId`.

Payload:

```json
{
  "studentId": 1042,
  "notification": {
    "id": "uuid",
    "type": "Result",
    "message": "Semester results announced",
    "createdAt": "timestamp"
  }
}
```

## Stage 2 - Database Design

### students

| Field | Type | Notes |
| --- | --- | --- |
| id | BIGINT | Primary key |
| name | VARCHAR(120) | Student name |
| email | VARCHAR(255) | Unique |
| createdAt | TIMESTAMP | Default current timestamp |

### notifications

| Field | Type | Notes |
| --- | --- | --- |
| id | UUID | Primary key |
| studentId | BIGINT | Foreign key to students.id |
| type | ENUM('Event','Result','Placement') | Notification category |
| message | TEXT | Notification body |
| isRead | BOOLEAN | Default false |
| createdAt | TIMESTAMP | Default current timestamp |

Fetch notifications:

```sql
SELECT id, studentId, type, message, isRead, createdAt
FROM notifications
WHERE studentId = ?
ORDER BY createdAt DESC
LIMIT ? OFFSET ?;
```

Mark as read:

```sql
UPDATE notifications
SET isRead = true
WHERE id = ?;
```

Indexing strategy:

```sql
CREATE INDEX idx_notifications_student_created
ON notifications (studentId, createdAt DESC);

CREATE INDEX idx_notifications_student_type_created
ON notifications (studentId, type, createdAt DESC);

CREATE INDEX idx_notifications_student_read_created
ON notifications (studentId, isRead, createdAt);
```

Scaling issues and solutions:

- Millions of rows make full scans expensive, so queries must use selective composite indexes.
- Hot users can create cache pressure, so cache recent unread notifications in Redis with short TTLs.
- Heavy read traffic should use read replicas.
- Old notifications can be partitioned by month or archived.
- Writes should go through a queue when fan-out is large.

## Stage 3 - Query Optimization

Given:

```sql
SELECT * FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

Why slow:

- Without a composite index, the database may scan many notification rows.
- Filtering on `studentId` and `isRead` and sorting by `createdAt` require extra work.
- The `ORDER BY` can trigger a filesort when the index does not match the query.

Optimized index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications (studentId, isRead, createdAt);
```

Why indexing every column is bad:

- Every insert, update, and delete must update all related indexes.
- Indexes consume storage and memory.
- Too many indexes confuse query planning and slow writes.

Students with no notifications in the last 7 days:

```sql
SELECT s.id
FROM students s
LEFT JOIN notifications n
  ON n.studentId = s.id
  AND n.createdAt >= NOW() - INTERVAL 7 DAY
WHERE n.id IS NULL;
```

## Stage 4 - Performance Optimization

Pagination:

- Always request bounded pages with `page` and `limit`.
- Prevents large payloads and protects the database.

Redis caching:

- Cache latest unread notifications per student.
- Use TTL and invalidate on notification creation/read updates.

Read replicas:

- Route read-heavy notification fetches to replicas.
- Keep writes on the primary database.

Lazy loading:

- Load initial page first.
- Fetch more only when the user paginates or scrolls.

WebSockets:

- Push new notifications instantly.
- Avoids expensive polling for 50,000 users.

Trade-offs:

- Cache is fast but may briefly serve stale data.
- Indexes speed reads but slow writes.
- WebSockets improve freshness but require connection management.
- Replicas scale reads but introduce replication lag.

## Stage 5 - System Design

Sequential pseudocode problem:

```text
for each student:
  save notification
  send email
  push mobile notification
```

Problems:

- One slow email provider blocks all later work.
- A failure can stop the whole batch.
- Large fan-out cannot scale for 50,000 users.
- No retry or failure isolation exists.

Redesign:

- API validates request and publishes a job to Kafka or RabbitMQ.
- Workers consume jobs asynchronously.
- Database writes, email, and push notifications are separate worker responsibilities.
- Failed jobs retry with exponential backoff.
- Permanently failed jobs go to a dead letter queue.

Improved pseudocode:

```text
POST /notifications
  validate request
  publish NotificationCreated job to queue
  return 202 Accepted

notification_worker(job)
  save notification to database
  publish EmailRequested job
  publish PushRequested job
  publish WebSocketBroadcast job

email_worker(job)
  try send email
  retry up to 3 times with backoff
  if still failing, move to dead letter queue

push_worker(job)
  try send push notification
  retry up to 3 times with backoff
  if still failing, move to dead letter queue
```

