# 🛡️ Daily Quest Tracker – Phase 1: Secure Server Setup

## 🔐 SSL Certificate
I used **OpenSSL** to generate a self-signed certificate for local development. This allowed me to run the app securely using `HTTPS` on `localhost` without needing a registered domain. The certificate and key files (`cert.pem` and `key.pem`) are located in the `cert/` folder.

## 🧱 Security Headers with Helmet
To protect against common web vulnerabilities, I implemented several secure HTTP headers using the `helmet` middleware:
- **Content-Security-Policy (CSP)** – Restricts external sources to prevent XSS.
- **X-Frame-Options** – Prevents clickjacking by disallowing framing.
- **X-Content-Type-Options** – Disables MIME-type sniffing.

## 🎨 UI & Routing
Instead of using static files, I built the app using **inline HTML templates** directly in the server code. The layout is styled with embedded CSS and uses semantic tags like `<header>`, `<main>`, `<nav>`, and `<section>` to ensure proper structure and accessibility.

### Routes Overview

| Route            | Description              | Cache Policy                     | Security Notes                        |
|------------------|--------------------------|----------------------------------|---------------------------------------|
| GET `/`          | Landing page             | no-store                         | No sensitive data                     |
| GET `/goals`     | View daily goals         | 5 min + stale-while-revalidate   | Public content                        |
| GET `/goals/:id` | View single goal detail  | 5 min                            | Safe to cache                         |
| POST `/create-goal` | Create a goal         | no-store                         | Accepts user input                    |
| GET `/profile`   | View player stats        | no-store                         | Personal/sensitive info               |

## 📦 Project Structure

| Folder     | Description                                  |
|------------|----------------------------------------------|
| `phase-1/` | Secure HTTPS server with Helmet + Caching    |
| `phase-2/` | (Coming Soon)                                |
| `phase-3/` | (Coming Soon)                                |
| `phase-4/` | (Coming Soon)                                |


## 💡 Reflection

### SSL Setup
I chose OpenSSL because it provides an easy and fast way to simulate HTTPS locally. Since I wasn’t deploying to a live server, this was the most practical method for development and testing.

### Security Implementation
Helmet simplified the process of applying industry-standard security headers. The only minor challenge was tweaking the Content-Security-Policy to allow inline styles without weakening overall security. I resolved this by limiting `styleSrc` to `'self'` and `'unsafe-inline'` while keeping scripts locked down.

### Design Approach
Rather than use static files or a frontend framework, I rendered all pages using embedded HTML in Node.js. This gave me full control over what content is served and allowed me to keep everything inside one file for clarity and focus on security.

### Caching Strategy
To improve performance while maintaining security, I applied caching selectively:
- **Public goal data** is cached for 5 minutes to enhance speed.
- **Private/profile routes** and user-created content are explicitly marked with `no-store` to prevent any sensitive data from being stored in browser or proxy caches.

## 🧪 How to Run

```bash
npm install
cd phase-1
node server.js
Then open your browser to:
📍 https://localhost:3000
(If prompted, click “Proceed anyway” to accept the self-signed cert.)