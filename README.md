
# Intelli-Task-Reminder
Task Reminder system
=======
# 📅 Task Reminder App

This Task Reminder application is built on the MERN (MongoDB, Express, React, Node.js) stack, allowing users to manage tasks and receive daily reminders about pending tasks via email.

## Features

✅ User Authentication using JWT for secure access  
🔐 Complete hashing and salting for password privacy  
📧 Uses SendGrid API for sending daily task reminder emails  
⏰ Cron job scheduled at 8 AM daily to notify users of due tasks  
👤 Maintains three separate models: Profile, Tasks, and Users  



### Prerequisites

- React.js
- Node.js
- MongoDB
- SendGrid API Key


## API Endpoints

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: User login and authentication
- `GET /api/profile`: Get user profile details
- `POST /api/tasks/add`: Add a new task
- `GET /api/tasks/:id`: Get task details by ID
- `PUT /api/tasks/:id`: Update task details
- `DELETE /api/tasks/:id`: Delete a task

