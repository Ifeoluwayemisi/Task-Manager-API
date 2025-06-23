# Task Manager API

A simple task management backend API built with **Node.js**, **Express**, and **MySQL** using **Sequelize CLI**.

## ✨ Features
- User registration and login with JWT
- Task creation, update, and deletion
- Filter tasks by priority, status, and deadline
- Email notification on task creation

## 🛠 Tech Stack
- Node.js, Express.js
- Sequelize CLI with MySQL
- Nodemailer for email service
- JWT for authentication

## ⚙️ Setup Instructions
1. Clone the repository
2. Add a `.env` file (see example below)
3. Run: `npm install` to install dependencies
4. Run: `npm run dev` to start the development server

## 🌐 API Endpoints

### 🔐 Auth
| Method |       Endpoint             |     Description           |
|--------|----------------------------|---------------------------|
| POST   | `/api/auth/register`       | Register user             |
| POST   | `/api/auth/login`          | Login user                |
| POST   | `/api/auth/forgot-password`| Send password reset email |
| POST   | `/api/auth/reset-password` | Reset password via token  |

### 📋 Tasks (Requires JWT in `Authorization` header)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/tasks`       | Get all tasks      |
| POST   | `/api/tasks`       | Create a task      |
| PUT    | `/api/tasks/:id`   | Update a task      |
| DELETE | `/api/tasks/:id`   | Delete a task      |

## .env Example

# Database Configuration
DB_HOST=localhost
DB_PORT=your_MySQL_PORT 
DB_USER=uSERNAME
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Email Configuration 
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password


```  ✅ Todo / Improvements
* Pagination for task list
* Soft deletes or task archive
* Frontend dashboard
* Unit tests

👨‍💻 Author
* Name: Racheal
* GitHub: @Ifeoluwayemisi