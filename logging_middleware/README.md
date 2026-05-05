# Logging Middleware

Reusable logger for the Campus Hiring Full Stack Evaluation.

```js
const { Log } = require('./logging_middleware/logger');

await Log('backend', 'error', 'handler', 'received string, expected bool');
```

The exact request JSON sent to the evaluation service is:

```json
{
  "stack": "backend",
  "level": "error",
  "package": "handler",
  "message": "received string, expected bool"
}
```

Set `LOG_ACCESS_TOKEN` when the logging API requires:

```http
Authorization: Bearer <access_token>
```

