# Employee Management System

A full-stack application for managing employee records with secure JWT authentication, complete CRUD operations, and responsive design. Built with Node.js, MongoDB, React, and Vite.

## ✨ Key Features

- User registration & login with JWT tokens
- Complete employee CRUD operations
- Protected API routes with middleware
- Responsive React dashboard
- Real-time notifications
- Token persistence & auto-injection
- Secure password hashing

## 📋 Tech Stack

**Backend**: Express.js, MongoDB, Mongoose, JWT, Bcryptjs  
**Frontend**: React, Vite, Axios, React Router  
**Database**: MongoDB  
**Authentication**: JWT + Bcryptjs

## 📂 Quick Structure

```
employee-management-system/
├── backend/          # Express API server
├── frontend/         # React application
│   └── frontend/
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
EOF

npm run dev
```

API runs on `http://localhost:5000/api`

### Frontend Setup

```bash
cd frontend/frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## 📊 API Endpoints

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login user |
| GET | `/employees` | Yes | Get all employees |
| POST | `/employees` | Yes | Create employee |
| PUT | `/employees/:id` | Yes | Update employee |
| DELETE | `/employees/:id` | Yes | Delete employee |

## 🔐 Authentication

- User registration/login returns JWT token
- Token stored in localStorage
- Auto-injected by Axios interceptor
- Protected routes checked via middleware
- 24-hour token expiration

## 🎯 User Flow

```
1. Register at /register
2. Login at /login to get JWT token
3. Access /dashboard (protected)
4. Manage employees (CRUD)
5. Logout to clear session
```

## 📦 npm Scripts

**Backend**:
```bash
npm start              # Production
npm run dev           # Development with nodemon
```

**Frontend**:
```bash
npm run dev           # Dev server
npm run build         # Production build
npm run preview       # Preview build
npm run lint          # Check code
```

## 🛠️ Database Models

**User**: name, email (unique), password (hashed), timestamps

**Employee**: name, email (unique), department, designation, salary, joiningDate, createdBy (user ref), timestamps

## 🔒 Security

- ✅ JWT authentication (24h expiry)
- ✅ Bcryptjs password hashing (10 rounds)
- ✅ Protected routes via middleware
- ✅ CORS enabled
- ✅ Input validation
- ✅ Unique email constraints

## 🐛 Troubleshooting

**Backend won't connect to MongoDB**
- Verify MongoDB is running
- Check MONGO_URI in .env

**Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check API baseURL in `src/services/api.js`

**Port conflicts**
- Backend: Change PORT in .env
- Frontend: `npm run dev -- --port 3000`

**Dependencies issues**
```bash
rm -rf node_modules
npm install
```

## 📖 Documentation

- [Backend README](backend/README.md) - API docs, setup details
- [Frontend README](frontend/frontend/README.md) - Component guide, deployment

## 🚦 Getting Started

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend/frontend && npm run dev`
3. **Register**: Navigate to `/register`
4. **Login**: Go to `/` with your credentials
5. **Manage**: Use dashboard to manage employees

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit: `git commit -m 'Add feature'`
3. Push: `git push origin feature/name`
4. Open Pull Request

## 📄 License

MIT License - See LICENSE file

## 📞 Support

Create an issue in the repository for bugs or feature requests.

---

**Version**: 1.0.0 | **Status**: Active | **Updated**: February 2024
