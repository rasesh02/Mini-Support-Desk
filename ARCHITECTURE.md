# Architecture

## 1) High-level architecture

### Overview
The system is a simple ticketing app with a Vite/React frontend and a Node/Express backend. The frontend consumes a REST API over HTTPS/JSON. The backend exposes ticket and comment endpoints and uses a database layer for persistence.

### Frontend → Backend communication
- Requests are JSON over HTTP; responses are JSON with standard HTTP status codes.
- The UI pages fetch data on load and submit mutations (create ticket, add comment) through the APIs.

### Backend layers/modules
Current code uses a classic Express structure. Conceptually the backend is layered as:

1. **Routes**: map HTTP routes to controller handlers.
   - Tickets: [backend/src/routes/tickets.routes.js](backend/src/routes/tickets.routes.js)
   - Comments: [backend/src/routes/comment.routes.js](backend/src/routes/comment.routes.js)
2. **Controllers**: parse inputs, call business logic, shape responses.
   - Tickets: [backend/src/controllers/ticket.controller.js](backend/src/controllers/ticket.controller.js)
   - Comments: [backend/src/controllers/comment.controller.js](backend/src/controllers/comment.controller.js)
3. **Services (logical layer)**: business rules, validation beyond simple schema checks, orchestration. This is small today and embedded in controllers, but the architecture assumes this layer can be extracted as the app grows.
4. **Repositories/Models**: data access and persistence logic.
   - Ticket model: [backend/src/models/ticket.model.js](backend/src/models/ticket.model.js)
   - Comment model: [backend/src/models/comment.model.js](backend/src/models/comment.model.js)
5. **Database**: configured in [backend/src/db/index.js](backend/src/db/index.js)

This separation keeps request handling, business rules, and data access distinct and makes it easier to test and evolve each layer.

## 2) Data model decisions

### Ticket
Tickets are the primary entity with fields for identity, title, description, status, priority, and timestamps. Modeling tickets as a top-level collection keeps lookups and list operations straightforward and supports future indexing on status/priority for filtering.

### Comment
Comments are modeled as a separate collection referencing a ticket. This keeps ticket documents lean (avoids large embedded arrays) and enables efficient pagination or moderation at the comment level. It also makes it easier to enforce permissions or soft-delete comments without rewriting the ticket document.

### Why this model
- **Scalability**: Separating comments avoids unbounded growth on ticket documents.
- **Query flexibility**: Independent queries for tickets and comments allow separate pagination and indexing.
- **Simplicity**: Clear ownership: a comment always belongs to a ticket via `ticketId`.

## 3) Scalability considerations

### Large ticket list
- **Pagination**: Use limit/offset or cursor-based pagination in list endpoints. Cursor-based pagination (by `createdAt` or `id`) is preferred for consistency with high insert rates.
- **Indexes**: Add indexes on `createdAt`, `status`, `priority` to speed list filtering and sorting.


### Search performance
- **Text indexes**: Use database text indexes on ticket `title` and `description` for full-text search.

### Pagination of comments
- Comment listing endpoints should always be paginated. Index `ticketId` + `createdAt` to support fast retrieval of recent comments.

## 4) Reliability

### Error handling strategy
- **Centralized error handling**: Controllers should pass errors to a single Express error middleware for consistent responses.
- **HTTP status codes**: Use 4xx for client errors (validation, not found) and 5xx for server errors.
- **Safe messages**: Return user-friendly error messages; log detailed errors server-side.

### Validation
- **Request validation**: Validate body/query/params for each route (e.g., required fields, string length, enum values).
- **Database constraints**: Enforce required fields and indexes at the model layer.

### Edge cases
- Creating comments for missing tickets returns 404.
- Empty list responses return 200 with an empty array.
- Invalid IDs return 400 with a clear error.

## 5) Tradeoffs

- **Service layer not fully separated yet**: Controllers currently do most of the orchestration to keep the codebase small. As complexity grows, services can be extracted without changing route signatures.
- **No advanced search engine**: Not added to keep dependencies minimal; text indexes are adequate for small to medium data sets.
- **Caching not implemented**: Simplifies deployment and avoids cache invalidation complexity. Can be added once load grows.
- **Limited auth/permissions**: Not expanded here to keep focus on core ticket flow; can be added via middleware and role-based checks.
