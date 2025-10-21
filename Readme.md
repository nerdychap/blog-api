# Blog API

A modern RESTful API for a blog application built with Node.js, Express, and TypeScript. This API provides user authentication, user management, and blog post operations with robust security features.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: sqlite
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Security**: Helmet, Rate Limiting

## ✨ Features

- User registration and authentication
- JWT-based authentication and authorization
- CRUD operations for users, blog posts and comments
- Password encryption with bcrypt
- Rate limiting and security headers
- Type-safe database operations with Prisma
- Global error handling

## 🚀 Quick Setup

### Prerequisites

- Node.js (v16+)
- sqlite database
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
- `PATCH /api/v1/auth/reset-password` - User reset password

### Users

- `GET /api/v1/users` - Get user profile (protected)

### Posts

- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post (protected)
- `GET /api/v1/posts/:id` - Get post by ID
- `PUT /api/v1/posts/:id` - Update post (protected)
- `DELETE /api/v1/posts/:id` - Delete post (protected)

### Comments

- `GET /api/v1/comments/post/:postId` - Get all comments for a post
- `POST /api/v1/comments` - Create a comment (protected)
- `PATCH /api/v1/comments/:id` - Update a comment (protected)
- `DELETE /api/v1/comments/:id` - Delete a comment (protected)

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📁 Project Structure

```
src/
├── config/           # Environment configuration
├── controllers/      # Route handlers
├── middleware/       # Custom middleware
├── prisma/          # Database client
├── routes/          # API routes
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```
