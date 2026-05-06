# Notification Backend

Express TypeScript backend for the Affordmed notification evaluation.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

## Routes

- `GET /health`
- `GET /notifications`
- `POST /notifications`
- `PATCH /notifications/:id/read`
- `DELETE /notifications/:id`
- `GET /notifications/priority`

All routes are also exposed under `/api/v1`.

## Production Features

- Helmet
- CORS
- Compression
- Rate limiting
- Request IDs
- Global error handler
- Response formatter
- Graceful shutdown
- Logging middleware integration
- Priority inbox using min heap, `O(n log k)`
