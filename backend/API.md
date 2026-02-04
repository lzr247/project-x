# Project-X API Documentation

Base URL: `http://localhost:3000/api`

---

## Authentication

Za sve rute osim `/auth/*` potreban je JWT token u headeru:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST `/api/auth/register`

Registracija novog korisnika.

**Request Body:**

```json
{
  "email": "user@example.com", // required, valid email
  "password": "123456", // required, min 6 karaktera
  "name": "John Doe" // optional, min 2 karaktera
}
```

**Success Response (201):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

**Error Responses:**

- `400` - Registration failed (email već postoji) ili validation error
- `500` - Server error

---

### POST `/api/auth/login`

Login korisnika.

**Request Body:**

```json
{
  "email": "user@example.com", // required, valid email
  "password": "123456" // required
}
```

**Success Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

**Error Responses:**

- `401` - Invalid credentials
- `500` - Server error

---

## Project Endpoints

> Svi project endpointi zahtevaju autentifikaciju (Bearer token)

### GET `/api/projects`

Dohvata sve projekte trenutnog korisnika.

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "My Project",
      "description": "Project description",
      "color": "#3B82F6",
      "isCompleted": false,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "userId": "user-uuid",
      "goals": [
        {
          "id": "goal-uuid",
          "title": "Goal title",
          "description": "Goal description",
          "isCompleted": false,
          "createdAt": "2026-01-01T00:00:00.000Z",
          "updatedAt": "2026-01-01T00:00:00.000Z",
          "projectId": "uuid"
        }
      ]
    }
  ]
}
```

**Error Responses:**

- `401` - Unauthorized (nema/neispravan token)
- `500` - Server error

---

### GET `/api/projects/:id`

Dohvata pojedinačni projekat po ID-u.

**URL Params:**

- `id` - UUID projekta

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My Project",
    "description": "Project description",
    "color": "#3B82F6",
    "isCompleted": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "userId": "user-uuid",
    "goals": []
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Project not found
- `500` - Server error

---

### POST `/api/projects`

Kreira novi projekat.

**Request Body:**

```json
{
  "title": "My New Project", // required, 1-100 karaktera
  "description": "Description", // optional, max 500 karaktera
  "color": "#FF5733" // optional, hex format (#RRGGBB), default: #3B82F6
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My New Project",
    "description": "Description",
    "color": "#FF5733",
    "isCompleted": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "userId": "user-uuid"
  }
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

---

### PUT `/api/projects/:id`

Ažurira postojeći projekat.

**URL Params:**

- `id` - UUID projekta

**Request Body (sva polja opciona):**

```json
{
  "title": "Updated Title", // optional, 1-100 karaktera
  "description": "New desc", // optional, max 500 karaktera
  "color": "#00FF00", // optional, hex format
  "isCompleted": true // optional, boolean
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "description": "New desc",
    "color": "#00FF00",
    "isCompleted": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-02T00:00:00.000Z",
    "userId": "user-uuid"
  }
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized
- `404` - Project not found
- `500` - Server error

---

### DELETE `/api/projects/:id`

Briše projekat (i sve goals unutar njega - cascade).

**URL Params:**

- `id` - UUID projekta

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project deleted successfully."
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Project not found
- `500` - Server error

---

## Goal Endpoints

> Svi goal endpointi zahtevaju autentifikaciju (Bearer token)

### GET `/api/projects/:projectId/goals`

Dohvata sve ciljeve za određeni projekat.

**URL Params:**

- `projectId` - UUID projekta

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "goal-uuid",
      "title": "Goal title",
      "description": "Goal description",
      "isCompleted": false,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "projectId": "project-uuid"
    }
  ]
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Project not found
- `500` - Server error

---

### POST `/api/projects/:projectId/goals`

Kreira novi cilj za projekat.

**URL Params:**

- `projectId` - UUID projekta

**Request Body:**

```json
{
  "title": "New Goal", // required, 1-200 karaktera
  "description": "Goal desc" // optional, max 500 karaktera
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "goal-uuid",
    "title": "New Goal",
    "description": "Goal desc",
    "isCompleted": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "projectId": "project-uuid"
  }
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized
- `404` - Project not found
- `500` - Server error

---

### PUT `/api/goals/:id`

Ažurira postojeći cilj.

**URL Params:**

- `id` - UUID cilja

**Request Body (sva polja opciona):**

```json
{
  "title": "Updated Goal", // optional, 1-200 karaktera
  "description": "New desc", // optional, max 500 karaktera
  "isCompleted": true // optional, boolean
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "goal-uuid",
    "title": "Updated Goal",
    "description": "New desc",
    "isCompleted": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-02T00:00:00.000Z",
    "projectId": "project-uuid"
  }
}
```

> **Napomena:** Postoji bug u backend kodu - response vraća `success: false` umesto `success: true` iako je operacija uspešna.

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized
- `404` - Goal not found
- `500` - Server error

---

### DELETE `/api/goals/:id`

Briše cilj.

**URL Params:**

- `id` - UUID cilja

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "message": "Goal deleted successfully."
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Goal not found
- `500` - Server error

---

## Pomodoro Endpoints

> Svi pomodoro endpointi zahtevaju autentifikaciju (Bearer token)

### POST `/api/pomodoro/start`

Započinje novu pomodoro sesiju.

**Request Body:**

```json
{
  "duration": 25, // optional, 1-120 minuta, default: 25
  "projectId": "project-uuid" // optional, povezuje sesiju sa projektom
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "session-uuid",
    "duration": 25,
    "startTime": "2026-01-01T10:00:00.000Z",
    "endTime": null,
    "completed": false,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "userId": "user-uuid",
    "projectId": "project-uuid" // ili null ako nije povezan sa projektom
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Project not found (ako je projectId prosleđen a ne postoji)
- `500` - Server error

---

### POST `/api/pomodoro/:id/complete`

Završava pomodoro sesiju.

**URL Params:**

- `id` - UUID pomodoro sesije

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "session-uuid",
    "duration": 25,
    "startTime": "2026-01-01T10:00:00.000Z",
    "endTime": "2026-01-01T10:25:00.000Z",
    "completed": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "userId": "user-uuid",
    "projectId": "project-uuid"
  }
}
```

**Error Responses:**

- `400` - Session already completed
- `401` - Unauthorized
- `404` - Session not found
- `500` - Server error

---

### GET `/api/pomodoro/stats`

Dohvata statistiku pomodoro sesija.

**Query Params:**

- `period` - optional: `"today"` | `"week"` | `"month"` | `"all"` (default: `"today"`)

**Request:** Nema body

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "period": "today",
    "totalSessions": 5,
    "totalMinutes": 125,
    "byProject": [
      {
        "projectId": "project-uuid",
        "projectTitle": "My Project",
        "count": 3,
        "minutes": 75
      },
      {
        "projectId": "no-project",
        "projectTitle": "No Project",
        "count": 2,
        "minutes": 50
      }
    ]
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

---

## Data Models (TypeScript Tipovi)

```typescript
// User (bez passworda u response-u)
interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string; // ISO date string
  updatedAt: string;
}

// Project
interface Project {
  id: string;
  title: string;
  description: string | null;
  color: string; // hex format, npr. "#3B82F6"
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  goals?: Goal[]; // uključeno u GET /projects i GET /projects/:id
}

// Goal
interface Goal {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

// PomodoroSession
interface PomodoroSession {
  id: string;
  duration: number; // u minutama
  startTime: string;
  endTime: string | null;
  completed: boolean;
  createdAt: string;
  userId: string;
  projectId: string | null;
  project?: Project; // uključeno u stats
}

// Auth Response
interface AuthResponse {
  user: User;
  token: string;
}

// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[]; // samo kod validation errora
}

// Pomodoro Stats
interface PomodoroStats {
  period: "today" | "week" | "month" | "all";
  totalSessions: number;
  totalMinutes: number;
  byProject: {
    projectId: string;
    projectTitle: string;
    count: number;
    minutes: number;
  }[];
}
```

---

## Validation Error Format

Kada validacija failuje (400 status):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Title is required",
      "path": "title",
      "location": "body"
    }
  ]
}
```

---

## Quick Reference

| Method | Endpoint                         | Auth | Opis                 |
| ------ | -------------------------------- | ---- | -------------------- |
| POST   | `/api/auth/register`             | ❌   | Registracija         |
| POST   | `/api/auth/login`                | ❌   | Login                |
| GET    | `/api/projects`                  | ✅   | Lista projekata      |
| GET    | `/api/projects/:id`              | ✅   | Pojedinačni projekat |
| POST   | `/api/projects`                  | ✅   | Kreiranje projekta   |
| PUT    | `/api/projects/:id`              | ✅   | Update projekta      |
| DELETE | `/api/projects/:id`              | ✅   | Brisanje projekta    |
| GET    | `/api/projects/:projectId/goals` | ✅   | Lista ciljeva        |
| POST   | `/api/projects/:projectId/goals` | ✅   | Kreiranje cilja      |
| PUT    | `/api/goals/:id`                 | ✅   | Update cilja         |
| DELETE | `/api/goals/:id`                 | ✅   | Brisanje cilja       |
| POST   | `/api/pomodoro/start`            | ✅   | Start pomodoro       |
| POST   | `/api/pomodoro/:id/complete`     | ✅   | Završi pomodoro      |
| GET    | `/api/pomodoro/stats`            | ✅   | Pomodoro statistika  |
