# TaskFlow — MERN Task Manager

A full-stack task management application built with **MongoDB, Express.js, React.js, and Node.js**.

---

## Features

- **User Auth** — Register/Login with JWT (7-day tokens, bcrypt password hashing)
- **Task CRUD** — Create, Read, Update, Delete tasks
- **Toggle Status** — Mark tasks as pending/completed
- **Priority Levels** — High / Medium / Low with color coding
- **Due Dates** — Overdue detection and highlighting
- **Search & Filter** — Full-text search, filter by status and priority
- **Pagination** — Server-side pagination (6 tasks/page)
- **Protected Routes** — JWT middleware guards all task endpoints
- **Responsive UI** — Dark-themed, mobile-friendly React SPA

---

## Project Structure

```
taskflow/
├── backend/
│   ├── models/
│   │   ├── User.js           # Mongoose User schema (name, email, password)
│   │   └── Task.js           # Mongoose Task schema (title, desc, status, priority, userId)
│   ├── routes/
│   │   ├── auth.js           # POST /register, POST /login, GET /me
│   │   └── tasks.js          # CRUD + toggle + search/filter/pagination
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/
        │   └── index.js      # Axios-style fetch wrapper for all API calls
        ├── context/
        │   └── AuthContext.jsx  # Global auth state (user, login, logout)
        ├── hooks/
        │   └── useTasks.js   # Custom hook: fetch, create, update, toggle, delete
        ├── pages/
        │   ├── Login.jsx     # Sign-in form with validation
        │   ├── Register.jsx  # Registration form with validation
        │   └── Dashboard.jsx # Main task management view
        ├── components/
        │   ├── TaskCard.jsx  # Individual task card
        │   └── TaskModal.jsx # Add/Edit modal
        └── package.json
```

---

## API Endpoints

| Method | Endpoint                   | Auth | Description                       |
|--------|----------------------------|------|-----------------------------------|
| POST   | /api/auth/register         | ✗    | Register new user                 |
| POST   | /api/auth/login            | ✗    | Login, returns JWT                |
| GET    | /api/auth/me               | ✓    | Get current user profile          |
| GET    | /api/tasks                 | ✓    | List tasks (search/filter/page)   |
| POST   | /api/tasks                 | ✓    | Create task                       |
| PUT    | /api/tasks/:id             | ✓    | Update task                       |
| PATCH  | /api/tasks/:id/toggle      | ✓    | Toggle pending ↔ completed        |
| DELETE | /api/tasks/:id             | ✓    | Delete task                       |

### Query Params for GET /api/tasks
```
?search=keyword&status=pending&priority=high&page=1&limit=6
```

---

## Database Schemas

### User
```js
{
  name:      String (required, max 50),
  email:     String (required, unique, validated),
  password:  String (required, min 6, bcrypt-hashed, select: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```js
{
  title:       String (required, max 100),
  description: String (max 500),
  status:      'pending' | 'completed',
  priority:    'low' | 'medium' | 'high',
  dueDate:     Date | null,
  userId:      ObjectId → User,
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/taskflow-mern.git
cd taskflow-mern
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev          # starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm start            # starts on http://localhost:3000
```

### 4. Environment variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

---

## Deployment

### Backend (Railway / Render / Heroku)
1. Push `backend/` to a repo or connect your monorepo
2. Set environment variables in the platform dashboard
3. Build command: `npm install` | Start command: `node server.js`
4. Use MongoDB Atlas for the cloud database

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend.railway.app/api` in env vars
2. Build command: `npm run build` | Publish directory: `build`

---

## Security
- Passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens expire in 7 days
- All task routes verify token via middleware
- Tasks are scoped to the authenticated user's ID (no cross-user access)
- Input validation on both client and server

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, React Router 6|
| Styling   | CSS (dark theme, custom)|
| Backend   | Node.js, Express 4      |
| Database  | MongoDB + Mongoose      |
| Auth      | JWT + bcryptjs          |
| Dev Tools | nodemon, dotenv         |
