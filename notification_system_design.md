# Notification System Design

## Stage 1: REST API Design

Base URLs:

- Local: `http://localhost:5000`
- Versioned: `/api/v1`

Required APIs:

### GET /notifications

Headers:

```text
X-Request-Id: optional client request id
```

Query:

- `page`: positive integer
- `limit`: 1-100
- `type`: `Placement`, `Result`, `Event`, `info`, `success`, `warning`, `error`
- `read`: `true` or `false`
- `sort`: `asc` or `desc`

Response `200`:

```json
{
  "success": true,
  "message": "Notifications fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Placement Update",
      "message": "Interview slot has been scheduled.",
      "type": "Placement",
      "createdAt": "2026-05-06T04:30:00.000Z",
      "read": false
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10 },
  "requestId": "uuid",
  "timestamp": "2026-05-06T04:30:00.000Z"
}
```

### POST /notifications

Body:

```json
{
  "title": "Placement Update",
  "message": "Interview slot has been scheduled.",
  "type": "Placement"
}
```

Status codes:

- `201`: created
- `400`: validation failure
- `429`: rate limited
- `500`: internal error

### PATCH /notifications/:id/read

Response `200`: updated notification. Response `404`: notification not found.

### DELETE /notifications/:id

Response `200`: deleted. Response `404`: notification not found.

### GET /notifications/priority

Fetches dynamic notifications from `GET /evaluation-service/notifications`, scores unread notifications, and returns top N using a min heap.

## Authentication Flow

```text
App starts
  |
  v
Logger checks CLIENT_ID and CLIENT_SECRET
  |
  +-- missing -> POST /register
  |
  v
POST /auth
  |
  v
Cache access token until near expiry
  |
  v
Attach Bearer token to /logs and evaluation API calls
  |
  v
Refresh token on expiry or 401
```

## Real-Time Notification Design

Use Server-Sent Events for one-way notification delivery:

```text
Client opens GET /notifications/stream
Backend authenticates user
Backend subscribes to notification channel
New notification event arrives
Backend emits SSE event to client
Client updates cache and UI
```

SSE is simpler than WebSockets for notification feeds because messages flow primarily from server to browser. WebSockets are preferred only when clients must send frequent real-time actions back.

## Stage 2: Database Design

Preferred database: PostgreSQL.

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  mobile_no VARCHAR(20),
  roll_no VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  student_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE notification_reads (
  user_id BIGINT NOT NULL REFERENCES users(id),
  notification_id BIGINT NOT NULL REFERENCES notifications(id),
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, notification_id)
);

CREATE INDEX idx_notifications_student_read_created
ON notifications(student_id, created_at);

CREATE INDEX idx_notification_reads_user_notification
ON notification_reads(user_id, notification_id);

CREATE INDEX idx_notifications_type_created
ON notifications(type, created_at DESC);
```

Partitioning:

- Partition `notifications` by month on `created_at`.
- Keep hot partitions on fast storage.
- Archive older partitions to cheaper storage.

Millions of records:

- Use cursor pagination on `(created_at, id)`.
- Add read replicas for feed reads.
- Use partial indexes for unread-heavy queries.
- Archive old notification bodies while retaining audit metadata.

## Stage 3: Query Optimization

Slow query:

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

Why slow:

- Without an index, PostgreSQL scans many rows.
- Filtering by student and read status happens row by row.
- Sorting by `createdAt` creates extra CPU and memory work.

Optimized index:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

Tradeoffs:

- Faster reads for this access pattern.
- Slower writes because the index must be maintained.
- More disk usage.
- Index should match the most common query predicates.

Placement notifications in last 7 days:

```sql
SELECT DISTINCT u.id, u.email, u.name
FROM users u
JOIN notifications n ON n.student_id = u.id
WHERE n.type = 'Placement'
AND n.created_at >= now() - interval '7 days';
```

Cursor pagination:

```sql
SELECT *
FROM notifications
WHERE student_id = $1
AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

OFFSET is simple but slows down on deep pages because skipped rows still need scanning. Cursor pagination is stable and efficient for infinite feeds.

## Stage 4: Performance Optimization

Problem: fetching notifications on every page load overloads the database.

Options and tradeoffs:

- Redis caching: reduces DB reads; requires invalidation strategy.
- Infinite scrolling: lowers initial payload; more client state complexity.
- Pagination: predictable load; users may need multiple requests.
- Lazy loading: improves first render; requires loading states.
- CDN: useful for static frontend assets; not ideal for personalized feeds.
- WebSockets/SSE: pushes updates; needs connection management.
- Debouncing: reduces repeated filter/search requests; adds slight delay.
- Polling: easy to implement; wasteful at high scale.
- Background sync: better UX; more complex client cache rules.
- Edge caching: low latency for public data; limited for user-specific private data.
- Read replicas: scales reads; introduces replication lag.

## Stage 5: Reliable Notify-All System

Flawed pseudocode issues:

- Sequential email, DB, and push calls.
- One failure blocks later students.
- No retries or dead-letter queue.
- Timeout risk for large batches.
- No idempotency.
- No backpressure.
- Resource exhaustion under load.
- Partial consistency with no recovery path.

Event-driven redesign:

```text
API receives notify-all request
  |
  v
Save notification campaign
  |
  v
Publish student notification jobs to RabbitMQ/Kafka
  |
  v
Distributed workers consume batches
  |
  +-- save notification row idempotently
  +-- send email
  +-- send push
  +-- retry transient failures
  +-- move poison messages to DLQ
```

Improved pseudocode:

```text
function notify_all(student_ids, message):
    campaign_id = save_campaign(message)
    for batch in chunk(student_ids, 500):
        publish("notification.batch.created", { campaign_id, batch, message })

worker notification_batch_worker(event):
    for student_id in event.batch:
        job_id = hash(event.campaign_id, student_id)
        publish("notification.student.requested", { job_id, student_id, message })

worker student_notification_worker(job):
    if already_processed(job.job_id):
        ack(job)
    begin transaction
        save_notification_if_absent(job.job_id, job.student_id, job.message)
        mark_job_processing(job.job_id)
    commit
    send_email_with_retry(job.student_id, job.message)
    send_push_with_retry(job.student_id, job.message)
    mark_job_completed(job.job_id)
```

DB save and email send should not be one database transaction because external email services cannot participate in a DB transaction. Save intent first, publish jobs, and make delivery eventually consistent with idempotency.

## Stage 6: Priority Inbox

Implemented endpoint:

```text
GET /notifications/priority?limit=10
```

Algorithm:

- Fetch dynamic notifications from evaluation service.
- Skip read notifications.
- Score by type weight plus recency score.
- Maintain top N using a min heap.
- Complexity: `O(n log k)`.

Weights:

- Placement: `100`
- Result: `70`
- Event: `40`

Sample output:

```json
{
  "success": true,
  "data": [
    { "id": "1", "type": "Placement", "score": 145.2, "rank": 1 }
  ],
  "meta": { "algorithm": "min-heap O(n log k)" }
}
```

## Stage 7: Frontend

The frontend uses React, Vite, and Material UI only. It includes:

- Notifications page
- Priority inbox page
- Responsive cards
- Filters
- Pagination
- Infinite-scroll style load more
- Skeleton loading
- Error and retry states
- Read/unread indicators
- Priority badges
- Simulated real-time refresh through user-triggered and lifecycle fetches
- Frontend logging middleware integration

## Security and Scalability

- Helmet protects common headers.
- CORS is environment-controlled.
- Rate limiting protects API from bursts.
- Request IDs make logs traceable.
- API versioning supports future breaking changes.
- Durable production storage should replace the in-memory store behind the data layer.
