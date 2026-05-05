# Notification Platform

Complete Campus Hiring Full Stack Evaluation submission.

## Folder Structure

```text
notification-system/
├── logging_middleware/
│   ├── logger.js
│   ├── api.js
│   └── README.md
├── notification_app_be/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── utils/
│   └── middleware/
├── notification_app_fe/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── notification-system_design.md
├── .gitignore
└── README.md
```

## Run Backend

```bash
cd notification-system/logging_middleware
npm install

cd notification-system/notification_app_be
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

## Run Frontend

```bash
cd notification-system/notification_app_fe
npm install
npm run dev
```

Set the frontend API URL if needed:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## Stage 6 Priority Inbox

```bash
cd notification-system/notification_app_be
node stage6_priority.js 1042
```

Sort order:

1. Placement
2. Result
3. Event
4. Latest timestamp

Returns top 10 notifications.

## Registration API

```http
POST http://20.207.122.201/evaluation-service/register
```

Request JSON:

```json
{
  "email": "your@email.com",
  "name": "your name",
  "mobileNo": "9999999999",
  "githubUsername": "yourGithub",
  "rollNo": "yourRoll",
  "accessCode": "yourAccessCode"
}
```

Response JSON:

```json
{
  "clientID": "string",
  "clientSecret": "string"
}
```

## Auth API

```http
POST http://20.207.122.201/evaluation-service/auth
```

Request JSON:

```json
{
  "email": "your@email.com",
  "name": "your name",
  "rollNo": "yourRoll",
  "accessCode": "yourAccessCode",
  "clientID": "string",
  "clientSecret": "string"
}
```

Response JSON:

```json
{
  "token_type": "Bearer",
  "access_token": "JWT_TOKEN",
  "expires_in": 1743574344
}
```

Use protected evaluation APIs with:

```http
Authorization: Bearer <access_token>
```
