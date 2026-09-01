# RentLedger

<p align="center">
  <img src="https://github.com/user-attachments/assets/c184ac4f-cc3d-4002-89fa-d37a24279d1c" alt="RentLedger logo" width="320" />
</p>

RentLedger is a full-stack MERN application for authentication, account management, and the foundation of a property management platform.

## Tech Stack

- **Frontend:** React 19, Vite 6, React Router 7, React Toastify
- **Backend:** Node.js, Express 5, MongoDB/Mongoose, Socket.IO
- **Security/Auth:** JWT (httpOnly cookies), Argon2 password hashing, Helmet, CORS, rate limiting
- **Tooling:** Vitest, Testing Library, ESLint, Prettier, Husky, GitHub Actions

## Current Features

- User registration, login, and logout
- Password reset flow (forgot password + reset token)
- Protected user profile API (get/update/delete)
- Avatar upload support via Cloudinary
- Role-aware auth helpers (`protect`, `admin`)
- API + auth rate limiting (Redis-backed when `REDIS_URL` is set)
- Shared Fetcher/Auth/Socket providers on the client

## Repository Structure

```text
rent-ledger/
├── client/              # React + Vite frontend
├── server/              # Express + Mongoose backend
├── .github/workflows/   # CI pipeline
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- MongoDB instance

### Install dependencies

```bash
npm run install-all
```

### Configure environment variables

Create `server/.env` and set required values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Optional server variables:

- `PORT` (default `5000`)
- `NODE_ENV`
- `CLIENT_URL`
- `FRONTEND_URL` (**required** for the password reset feature — used to build the reset link in emails; defaults to `http://localhost:5173` if not set)
- `REDIS_URL` (enables distributed rate limiting)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_NAME`, `FROM_EMAIL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`

Optional client variable (`client/.env`):

- `VITE_BACKEND_URL` (for production/custom backend URL)

### Run locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Scripts

### Root

- `npm run dev` – run client and server together
- `npm run client` – run client only
- `npm run server` – run server only
- `npm run install-all` – install root/client/server dependencies
- `npm run clean-install` – fresh reinstall across all packages
- `npm run format` – format client and server source files

### Client (`client/`)

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run test:coverage`

### Server (`server/`)

- `npm run dev`
- `npm start`
- `npm test`
- `npm run test:coverage`

## API Overview

Base path: `/api`

### Auth routes (`/api/auth`)

- `POST /register`
- `POST /login`
- `POST /logout`
- `GET /is-admin` (protected)
- `POST /forgotpassword`
- `PUT /resetpassword/:resettoken`

### User routes (`/api/users`)

- `GET /profile` (protected)
- `PUT /profile` (protected, supports avatar multipart upload)
- `DELETE /profile` (protected)

## CI

GitHub Actions runs on pushes/PRs to `main` and executes:

- **Client job:** `npm run lint`, `npm run build`, and `npm test`
- **Server job:** lint (syntax check via `node --check ...`) and `npm test`
