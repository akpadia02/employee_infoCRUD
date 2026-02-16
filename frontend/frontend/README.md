# Employee Management System - Frontend

A modern React application for employee record management with JWT authentication, protected routes, and responsive design. Built with Vite for fast development and Axios for API integration.

## 🚀 Features

- User login & registration with JWT authentication
- Employee CRUD dashboard (view, create, update, delete)
- Protected routes requiring authentication
- Real-time toast notifications
- Responsive mobile-friendly design
- Token persistence with localStorage
- Automatic token injection via Axios interceptors

## 📦 Tech Stack

- **React** ^18.2.0 - UI library
- **React Router** ^6.30.3 - Client routing
- **Axios** ^1.13.4 - HTTP client
- **Vite** ^7.2.4 - Build tool
- **React Toastify** ^11.0.5 - Notifications
- **React Icons** ^5.5.0 - Icons
- **ESLint** ^9.39.1 - Code linting

## 📂 Project Structure

```
frontend/src/
├── components/
│   └── Navbar.jsx          # Navigation & logout
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   └── Dashboard.jsx       # Employee management
├── services/
│   └── api.js              # Axios config & API calls
├── styles/                 # CSS files
├── App.jsx                 # Main routing
└── main.jsx                # Entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- Backend API running on `http://localhost:5000`

### Quick Start

```bash
cd frontend/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs on `http://localhost:5173`

## 📝 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Check code quality
npm run lint -- --fix   # Fix linting issues
```

## 🔌 Pages & Functionality

| Page | Path | Features |
|------|------|----------|
| Login | `/` | Email/password login with JWT |
| Register | `/register` | New user account creation |
| Dashboard | `/dashboard` | View & manage employees (protected) |

## 🔌 API Integration

```javascript
// src/services/api.js
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auto-inject JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
```

## 🎯 User Workflow

1. **Register** → Create new account at `/register`
2. **Login** → Authenticate with email/password at `/`
3. **Dashboard** → Manage employees after login
4. **CRUD Operations**:
   - **View**: See all employees in dashboard
   - **Create**: Add employee via form
   - **Update**: Edit employee details
   - **Delete**: Remove employee record
5. **Logout** → Clear token and return to login

## 🔐 Authentication

- JWT tokens stored in localStorage
- Tokens auto-injected in API requests
- Protected routes require valid token
- Logout clears token and session

## 🚦 Troubleshooting

**Cannot connect to backend**
```bash
# Ensure backend is running
cd backend && npm run dev
```

**Port already in use**
```bash
npm run dev -- --port 3000
```

**Module errors**
```bash
rm -rf node_modules
npm install
```

## 📱 Responsive Design

Optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with token verification
- Secure token storage & cleanup
- Input validation
- CORS-enabled

## 📚 Scripts & Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Test production build |
| `npm run lint` | Check code quality |

## 🎓 Key Technologies

- **React Router**: Client-side routing for navigation
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool & dev server
- **React Toastify**: User notifications
- **LocalStorage**: Persistent token storage

---
**Version**: 1.0.0 | **Last Updated**: February 2024
