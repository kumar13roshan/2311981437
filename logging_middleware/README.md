# Logging Middleware

Reusable TypeScript package exposing:

```ts
Log(stack, level, packageName, message)
createLogger(config)
authenticate()
register()
flushLogs()
```

Features:

- Dynamic registration and authentication
- Bearer token caching and refresh before expiry
- Retry handling for failures, `401`, and rate-limit responses
- Axios interceptors
- Request IDs and timestamps
- Validation for stack, level, and package
- Async queue and batching
- Console fallback with structured JSON output
- Browser and Node usage through configurable environment values

Install:

```bash
npm install
npm run typecheck
```

All sensitive fields come from environment variables.
