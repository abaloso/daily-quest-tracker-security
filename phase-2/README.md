# 🔐 Daily Quest Tracker – Phase 2: Secure Authentication System

## ✅ Overview
This phase adds a secure, scalable **authentication and authorization system** to the Daily Quest Tracker app. It includes local login with hashed passwords, Google OAuth 2.0 integration, JWT-based sessions, and role-based access control for secure protected routes.

---

## ⚙️ Features Implemented

### 🔐 Local Authentication
- Users can register and log in using email + password
- Passwords are hashed securely using `bcrypt` before storage
- Session is maintained using `HttpOnly` JWT cookie

### 🔑 Google OAuth 2.0
- Users can also authenticate using their Google accounts
- Integrated using `passport-google-oauth20`

### 🧾 Role-Based Access Control
- User roles: `User`, `Admin`
- Roles are stored in MongoDB and included in JWTs
- Middleware restricts access to sensitive routes based on role

### 🔒 JWT Session Management
- JWTs are signed and stored in `HttpOnly` cookies
- Tokens expire after 1 hour for security
- Middleware verifies tokens before allowing access to protected routes

### 🛡️ Session Security
- Secure cookie attributes: `HttpOnly`, `SameSite`, with optional `Secure`
- Session ID is regenerated with each login
- Helmet middleware is used for additional security headers

---

## 🧪 How to Use (Local Setup)
### 1. Install dependencies
-```bash
-"cd phase-2
-npm install

### 2. Create a .env file
PORT=3001
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_super_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

### 3. Run the app
- node server.js
- Server will run at:
📍 http://localhost:3001

## Key Routes
### Public
| Method | Route                | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Login with email/password |
| GET    | `/api/auth/google`   | Redirect to Google OAuth  |
| GET    | `/api/auth/logout`   | Clear session cookie      |

### Protected (JWT required)
| Method | Route            | Role(s) Allowed | Description               |
| ------ | ---------------- | --------------- | ------------------------- |
| GET    | `/api/profile`   | User, Admin     | View profile info         |
| GET    | `/api/admin`     | Admin only      | Admin-only control panel  |
| GET    | `/api/dashboard` | All             | Role-aware dashboard view |


## Testing with Postman
### Register a user
- POST → http://localhost:3001/api/auth/register
    {
        "email": "test@example.com",
        "password": "password123",
        "username": "TestUser"
    }

    Log in
    POST → http://localhost:3001/api/auth/login
    Returns: HttpOnly cookie containing a JWT.

    Access a protected route
    GET → http://localhost:3001/api/profile
    Must be logged in (JWT cookie set).

## Reflection
- Authentication Strategy: I implemented both local and Google OAuth to offer flexibility and improve UX. Local login is great for control, while OAuth adds convenience and trust.

- Access Control: I used a simple role-based system (User, Admin) stored in JWTs and enforced via middleware. This kept the logic clean and scalable.

- Security Challenges: One challenge was handling session security without exposing tokens. I solved this by using HttpOnly cookies and limiting token lifetime.

- Next Steps: Rate limiting, CSRF protection, and refresh tokens are planned for future improvement.

- This phase helped me apply real-world security practices using modern web tools like Passport, JWTs, and MongoDB. I now understand how to design secure login flows, manage user roles, and protect routes effectively.