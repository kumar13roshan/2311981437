# Affordmed Campus Hiring Evaluation

Complete TypeScript full-stack notification system covering the pre-test setup and Stage 1-7 evaluation tasks.

## Overview

This repository contains:

- Reusable logging middleware with registration, authentication, token refresh, retries, batching, queueing, request IDs, validators, and console fallback.
- Express backend with CRUD APIs, priority inbox endpoint, API versioning, Helmet, CORS, compression, rate limiting, request IDs, validation, and global error handling.
- React + Material UI frontend running only on `http://localhost:3000`.
- Postman collection and environment with dynamic variable storage.
- Docker Compose support.
- System design, database design, optimization notes, screenshot guide, and GitHub upload instructions.

No credentials, tokens, client IDs, or client secrets are hardcoded. Runtime values are loaded from `.env` files.

## Structure

```text
your-roll-number/
├── logging_middleware/
├── notification_app_be/
├── notification_app_fe/
├── postman/
├── screenshots/
├── demo-video/
├── notification_system_design.md
├── README.md
├── docker-compose.yml
├── .gitignore
└── LICENSE
```

## Installation

```bash
cd logging_middleware
npm install

cd ../notification_app_be
npm install

cd ../notification_app_fe
npm install
```

Copy environment examples:

```bash
cp logging_middleware/.env.example logging_middleware/.env
cp notification_app_be/.env.example notification_app_be/.env
cp notification_app_fe/.env.example notification_app_fe/.env
```

Fill the required values: `ACCESS_CODE`, `EMAIL`, `NAME`, `MOBILE_NO`, `GITHUB_USERNAME`, `ROLL_NO`. After registration, set `CLIENT_ID` and `CLIENT_SECRET` if you want to reuse credentials across restarts.

## Run

Backend:

```bash
cd notification_app_be
npm run dev
```

Frontend:

```bash
cd notification_app_fe
npm run dev
```

Frontend URL: `http://localhost:3000`

Backend URL: `http://localhost:5000`

## Docker

```bash
docker compose up --build
```

Services:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## APIs

- `GET /health`
- `GET /notifications?page=1&limit=10&type=Placement&sort=desc`
- `POST /notifications`
- `PATCH /notifications/:id/read`
- `DELETE /notifications/:id`
- `GET /notifications/priority?limit=10`
- Versioned equivalents under `/api/v1`.

Create body:

```json
{
  "title": "Placement Update",
  "message": "Interview slot has been scheduled.",
  "type": "Placement"
}
```

## Postman

Import:

- `postman/Affordmed_API_Collection.json`
- `postman/Affordmed_Environment.json`

Select the environment, fill credential variables, run `Register`, then `Authenticate`. The collection stores `clientID`, `clientSecret`, `access_token`, and `notificationId` automatically.

## Screenshots

Capture screenshots showing request body, response body, HTTP status, and response time for:

- Registration
- Authentication
- Logging API
- Notification create/list/read/delete
- Priority inbox
- Frontend desktop
- Frontend mobile
- Filters
- Pagination
- Error state and retry UI

Place images in `screenshots/`.

## Stage Summary

- Stage 1: REST API and real-time design are documented in `notification_system_design.md`.
- Stage 2: PostgreSQL schema, indexes, partitioning, and scalability are documented.
- Stage 3: Query optimization and composite index strategy are documented.
- Stage 4: Performance optimization tradeoffs are documented.
- Stage 5: Reliable notify-all queue architecture is documented.
- Stage 6: Priority inbox is implemented in backend using a min heap.
- Stage 7: Frontend is implemented with React and Material UI.

## GitHub Upload

```bash
git init
git add .
git commit -m "Initial setup"
git commit -m "Added logging middleware"
git commit -m "Implemented backend APIs"
git commit -m "Implemented priority inbox"
git commit -m "Implemented frontend UI"
git commit -m "Added documentation"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

Before pushing, run:

```bash
npm --prefix logging_middleware run typecheck
npm --prefix notification_app_be run typecheck
npm --prefix notification_app_fe run typecheck
```

## Troubleshooting

- If frontend does not start, confirm port `3000` is free.
- If backend logs fail, verify evaluation credentials and network access.
- If priority inbox fails, run registration/auth first or ensure `.env` contains valid credentials.
- Never commit `.env`, `node_modules`, build folders, screenshots with secrets, or Postman current values containing credentials.
