# Flask Backend API - Employee Management System

REST API built with Flask for managing employee records with JWT authentication and MongoDB.

## Quick Start

### Installation
```bash
pip install -r requirements.txt
```

### Environment Setup
Create `.env` file in the root directory:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key-here
```

### Run Server
```bash
python app.py
```
Server runs on `http://127.0.0.1:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Employees (Requires JWT)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/<id>` - Update employee
- `DELETE /api/employees/<id>` - Delete employee

## Request Examples

### Register
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "password123"
}
```

### Login
```json
{
  "email": "john@gmail.com",
  "password": "password123"
}
```
Response: `{"token": "...", "name": "John Doe"}`

### Create Employee
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "department": "Engineering",
  "designation": "Developer",
  "salary": 50000
}
```

## Validation Rules
- Name: Letters & spaces (2-50 chars)
- Email: Valid Gmail format
- Department/Role: Letters & spaces (2-50 chars)
- Salary: Positive integer
- Password: Min 6 characters

## Tech Stack
- Flask 3.1.2
- MongoDB 4.16.0
- JWT Authentication
- bcrypt (password hashing)
- CORS enabled

## Security
- Password hashing with bcrypt
- JWT token authentication
- User data isolation
- Input validation on all endpoints
- CORS restricted to frontend origin
