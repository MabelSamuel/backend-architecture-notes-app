# Notes App

A small Express + TypeScript API for managing notes, built to demonstrate a layered backend architecture: routes → controllers → services → repositories.

## Architecture

Each request flows through four layers, and each layer only calls the layer directly below it:

- **Routes** ([src/routes/note.routes.ts](src/routes/note.routes.ts)) — map HTTP method + path to a controller function. No logic.
- **Controllers** ([src/controllers/note.controller.ts](src/controllers/note.controller.ts)) — translate between HTTP (`req`/`res`) and the service layer. Extract input, call the service, shape the response.
- **Services** ([src/services/note.service.ts](src/services/note.service.ts)) — business logic. Knows nothing about HTTP; throws `AppError` for domain failures like "not found".
- **Repository** ([src/repositories/note.repository.ts](src/repositories/note.repository.ts)) — data access. Currently an in-memory array; swapping to a real database only requires changing this file.

Cross-cutting concerns live outside this stack:

- [src/middleware/validate.ts](src/middleware/validate.ts) — validates `req.body` against a Zod schema before it reaches the controller.
- [src/middleware/error-handler.ts](src/middleware/error-handler.ts) — catches thrown errors (`AppError` or otherwise) and formats a JSON error response; also handles unmatched routes (404).
- [src/lib/config.ts](src/lib/config.ts) — loads and validates environment variables with Zod at startup; the process exits immediately if config is invalid.
- [src/lib/logger.ts](src/lib/logger.ts) — structured JSON logging via Pino (pretty-printed in development).
- [src/lib/errors.ts](src/lib/errors.ts) — `AppError`, a typed error carrying an HTTP status code.

[src/app.ts](src/app.ts) wires everything together (security headers, CORS, JSON parsing, request logging, routes, 404/error handlers). [src/server.ts](src/server.ts) starts the HTTP server — kept separate from `app.ts` so tests can import the app without binding a port.

## Data model

Notes are stored **in memory** (they reset on every restart) and have the shape:

```ts
{
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

## API

All routes are mounted under `/api/v1/notes`.

| Method | Path              | Body                                 | Description                     |
| ------ | ------------------ | ------------------------------------- | -------------------------------- |
| GET    | `/api/v1/notes`     | —                                      | List all notes                   |
| GET    | `/api/v1/notes/:id` | —                                      | Get a single note by id          |
| POST   | `/api/v1/notes`     | `{ title: string, content: string }`  | Create a note                    |
| PATCH  | `/api/v1/notes/:id` | `{ title?: string, content?: string }`| Update a note (partial)          |
| DELETE | `/api/v1/notes/:id` | —                                      | Delete a note                    |

Requests to `POST`/`PATCH` are validated against Zod schemas in [src/schemas/note.schema.ts](src/schemas/note.schema.ts); `title` and `content` must be non-empty strings. Invalid bodies get a `400` with validation details.

A request for a note id that doesn't exist returns `404` with `{ error: { message: "Note <id> not found" } }`.

There's also a health check at `GET /health` that returns server status, timestamp, and environment.

### Example

```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Groceries", "content": "Milk, eggs, bread"}'
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   | Variable                   | Required | Default       | Notes                                  |
   | --------------------------- | -------- | ------------- | ---------------------------------------|
   | `NODE_ENV`                  | no       | `development` | `development` \| `production` \| `test`|
   | `PORT`                      | no       | `3000`        |                                         |
   | `DATABASE_URL`              | yes      | —             | Not yet used by the notes feature      |
   | `JWT_SECRET`                | yes      | —             | Must be at least 32 characters         |
   | `JWT_EXPIRES_IN`            | no       | `15m`         |                                         |
   | `REFRESH_TOKEN_EXPIRES_IN`  | no       | `7d`          |                                         |
   | `OPENAI_API_KEY`            | no       | —             | Reserved for later                     |
   | `REDIS_URL`                 | no       | —             | Reserved for later                     |

   If a required variable is missing or invalid, the app logs the Zod validation errors and exits immediately rather than starting in a broken state.

3. Run the dev server (auto-reloads on file changes):

   ```bash
   npm run dev
   ```

   The API is now available at `http://localhost:3000`.

## Scripts

| Script             | Description                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`        | Run the server with `tsx watch`           |
| `npm run build`      | Compile TypeScript to `dist/`             |
| `npm start`           | Run the compiled server (`dist/server.js`)|
| `npm run typecheck`  | Type-check without emitting output        |

## Notes on current limitations

- Storage is in-memory only — data does not persist across restarts, and `DATABASE_URL` is currently unused (a real database is expected to replace [src/repositories/note.repository.ts](src/repositories/note.repository.ts) later).
- There is no authentication yet, despite `JWT_SECRET` being configured.
