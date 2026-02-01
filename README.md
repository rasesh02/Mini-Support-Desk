# Mini Support Desk

A lightweight support ticket management system built with React and Node.js/Express. Create, track, and manage support tickets with comments.

## Features

- **Ticket Management**: Create, view, update, and delete support tickets
- **Status Tracking**: Track tickets through OPEN → IN_PROGRESS → RESOLVED
- **Priority Levels**: Assign LOW, MEDIUM, or HIGH priority
- **Comments**: Add comments to tickets for discussion and updates
- **Search & Filter**: Search tickets by title/description, filter by status and priority
- **Pagination**: Paginated lists for tickets and comments

## Tech Stack

### Frontend
- React 
- React Router v7
- Tailwind CSS v3
- Vite

### Backend
- Node.js with Express 5
- MongoDB with Mongoose

## Project Structure

```
Mini Support Desk/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   └── db/             # Database connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── lib/            # API client
│   └── package.json
├── ARCHITECTURE.md
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas connection string)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/support-desk
   PORT=5000
   CORS=*
   ```

4. Start the server:
   ```bash
   node src/index.js
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Tickets

#### Get All Tickets

```http
GET /tickets
```

**Query Parameters:**

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| q         | string | Search term for title and description            |
| status    | string | Filter by status: `OPEN`, `IN_PROGRESS`, `RESOLVED` |
| priority  | string | Filter by priority: `LOW`, `MEDIUM`, `HIGH`      |
| sort      | string | Sort fields (e.g., `-createdAt`, `priority`)     |
| page      | number | Page number (default: 1)                         |
| limit     | number | Items per page (default: 10)                     |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Login issue",
      "description": "Cannot login to dashboard",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2026-01-30T10:00:00.000Z",
      "updatedAt": "2026-01-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

#### Create Ticket

```http
POST /tickets
```

**Request Body:**

```json
{
  "title": "Login issue",
  "description": "Cannot login to the dashboard after password reset",
  "priority": "HIGH",
  "status": "OPEN"
}
```

| Field       | Type   | Required | Constraints                    |
|-------------|--------|----------|--------------------------------|
| title       | string | Yes      | 5–80 characters                |
| description | string | Yes      | 20–2000 characters             |
| priority    | string | No       | `LOW`, `MEDIUM`, `HIGH` (default: `LOW`) |
| status      | string | No       | `OPEN`, `IN_PROGRESS`, `RESOLVED` (default: `OPEN`) |

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Login issue",
    "description": "Cannot login to the dashboard after password reset",
    "status": "OPEN",
    "priority": "HIGH",
    "createdAt": "2026-01-30T10:00:00.000Z",
    "updatedAt": "2026-01-30T10:00:00.000Z"
  }
}
```

---

#### Get Ticket by ID

```http
GET /tickets/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Login issue",
    "description": "Cannot login to the dashboard after password reset",
    "status": "OPEN",
    "priority": "HIGH",
    "createdAt": "2026-01-30T10:00:00.000Z",
    "updatedAt": "2026-01-30T10:00:00.000Z"
  }
}
```

---

#### Update Ticket

```http
PATCH /tickets/:id
```

**Request Body:** (all fields optional)

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": { ... }
}
```

---

#### Delete Ticket

```http
DELETE /tickets/:id
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

---

### Comments

#### Get Comments for a Ticket

```http
GET /tickets/:id/comments
```

**Query Parameters:**

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| page      | number | Page number (default: 1) |
| limit     | number | Items per page (default: 10) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "ticketId": "...",
      "authorName": "John Doe",
      "message": "I've looked into this issue.",
      "createdAt": "2026-01-30T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

#### Add Comment to Ticket

```http
POST /tickets/:id/comments
```

**Request Body:**

```json
{
  "authorName": "John Doe",
  "message": "I've looked into this issue and found a fix."
}
```

| Field      | Type   | Required | Constraints        |
|------------|--------|----------|--------------------|
| authorName | string | Yes      | Author's name      |
| message    | string | Yes      | 1–500 characters   |

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "ticketId": "...",
    "authorName": "John Doe",
    "message": "I've looked into this issue and found a fix.",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

---

### Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**Common HTTP Status Codes:**

| Code | Description                          |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (validation error)       |
| 404  | Not Found                            |
| 500  | Internal Server Error                |

---

## License

MIT
