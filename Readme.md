# Blog API

A modern RESTful API for a blog application built with Node.js, Express, and TypeScript. This API provides user authentication, user management, and blog post operations with robust security features.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, Rate Limiting, CORS

## ✨ Features

- User registration and authentication
- JWT-based authentication and authorization
- CRUD operations for users, blog posts and comments
- Password encryption with bcryptjs
- Input validation and sanitization
- Rate limiting and security headers
- Type-safe database operations with Prisma
- Global error handling
- RESTful nested resource endpoints
- Authorization middleware for resource ownership

## 🚀 Quick Setup

### Prerequisites

- Node.js (v16+)
- SQLite database
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nerdychap/blog-api
   cd blog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   
   # Optional: Open Prisma Studio to view data
   npx prisma studio
   ```

5. **Start the application**

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/sign-up` - Register new user
- `POST /api/v1/auth/sign-in` - User login
- `POST /api/v1/auth/sign-out` - User logout (protected)
- `PATCH /api/v1/auth/reset-password` - Reset user password
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

### Users

- `GET /api/v1/users/:id` - Get user profile
- `PATCH /api/v1/users/:id` - Update user profile (protected, own profile only)
- `DELETE /api/v1/users/:id` - Delete user account (protected, own profile only)

### Posts

- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post (protected)
- `GET /api/v1/posts/:id` - Get post by ID with comments
- `PATCH /api/v1/posts/:id` - Update post (protected, author only)
- `DELETE /api/v1/posts/:id` - Delete post (protected, author only)

### Comments

- `GET /api/v1/posts/:postId/comments` - Get all comments for a post
- `POST /api/v1/posts/:postId/comments` - Create a comment (protected)
- `PATCH /api/v1/posts/:postId/comments/:commentId` - Update a comment (protected, author only)
- `DELETE /api/v1/posts/:postId/comments/:commentId` - Delete a comment (protected, author only)

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Authorization Levels:**
- **Public**: Anyone can access (GET posts, GET comments)
- **Authenticated**: Requires valid JWT token (POST posts/comments)
- **Owner Only**: User can only modify their own resources (UPDATE/DELETE posts/comments/profile)

## 📁 Project Structure

```
src/
├── config/              # Environment configuration
├── controllers/         # Route handlers
├── middleware/          # Custom middleware
│   ├── authentication/  # JWT authentication
│   ├── authorization/   # Resource ownership checks
├── prisma/             # Database client
├── routes/             # API routes
├── utils/              # Utility functions
│   └── validation/
├── generated/          # Prisma generated client
├── app.ts             # Express app setup
└── index.ts           # Server entry point
```
