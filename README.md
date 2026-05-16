# Peblo Notes AI

Peblo Notes AI is a complete full-stack production-quality AI-powered collaborative notes workspace. It offers a modern, startup-level design featuring dark mode, glassmorphism, and a robust feature set tailored for productivity.

## Project Overview
Peblo Notes AI allows users to create, organize, search, and publicly share notes. Integrated with Google's Gemini AI API, the platform provides automatic summaries, actionable insights, and title suggestions to elevate the note-taking experience.

## Architecture

This project is structured as a full-stack JavaScript application:

- **Frontend**: React + Vite, styled with TailwindCSS, utilizing Zustand for state management, Framer Motion for animations, and Axios for API communications. Features React Quill for rich-text editing.
- **Backend**: Node.js + Express, providing REST APIs. Uses MongoDB and Mongoose for data modeling. Features JWT authentication, bcrypt password hashing, and middleware-based protected routes.
- **AI Integration**: Communicates with Google's Gemini API via backend services. API keys are safely managed via environment variables.

## Folder Structure

```
peblo_notes/
├── client/                 # Frontend React/Vite app
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full page views
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API call definitions
│   │   ├── layouts/        # Page layout wrappers
│   │   └── utils/          # Helper functions
├── server/                 # Backend Node/Express app
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # Auth & error handling
│   ├── services/           # Business logic & AI integration
│   └── utils/              # Helper utilities
└── .env.example            # Environment variables template
```

## API Routes

### Auth
- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Authenticate user
- `POST /auth/logout`: End session

### Notes
- `GET /notes`: Fetch all user notes
- `POST /notes`: Create a new note
- `PUT /notes/:id`: Update a note
- `DELETE /notes/:id`: Remove a note
- `GET /notes/search?q=`: Keyword search
- `GET /notes/tag/:tag`: Tag filtering

### AI
- `POST /notes/:id/generate-ai`: Generate summary, actions, and title via Gemini

### Sharing
- `GET /shared/:shareId`: View a publicly shared note

## Setup Guide

### Environment Variables
Create a `.env` file in the `server/` directory using `.env.example` as a template:
```env
DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Running the Backend
```bash
cd server
npm install
npm run dev
```

### Running the Frontend
```bash
cd client
npm install
npm run dev
```

## Deployment
- **Frontend**: Optimized for deployment on Vercel. Ensure environment variables for API endpoints are configured.
- **Backend**: Optimized for deployment on Render. Ensure all `.env` variables are securely added in the platform dashboard.

## Screenshots
*(Example Screenshots Section - To be updated after deployment)*
- Login / Signup Screen
- Main Notes Workspace
- AI Insights Panel
- Productivity Dashboard