# FundForge – Crowdfunding Platform

A full-stack MERN-based crowdfunding web application that allows users to create fundraising campaigns, set funding goals, and receive contributions through a secure and user-friendly interface.

---

## Features

- User authentication (Signup/Login)
- Create new fundraising campaigns
- View campaign details
- Track funding progress dynamically
- Responsive UI using Tailwind CSS
- Protected routes for authenticated users
- Backend API integration
- Real-time funding updates
- Modular and reusable component structure

---

## Tech Stack

Frontend:
- React.js
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI

Backend:
- Node.js
- Express.js

Database & Authentication:
- Supabase
- Firebase Authentication

Deployment:
- Netlify (Frontend)
- Cloud-hosted backend (Render / similar)

---

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Supabase account
- Firebase project setup

---

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/fundforge.git

Create a .env file in the root directory and add:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

Start the development server:

npm run dev

The application will run at:

http://localhost:5173

Directory Structure
fundforge-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── README.md


