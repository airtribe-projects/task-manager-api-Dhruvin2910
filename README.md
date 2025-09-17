# Task Manager API

A simple Task Management REST API built with Node.js and Express.js, using a JSON file as a database.
This project supports basic CRUD operations for managing tasks.

---

## 🚀 Features

* Create new tasks
* Read all tasks or a single task by ID
* Update existing tasks
* Delete tasks
* JSON file (`task.json`) used as lightweight database

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-manager-api.git
   cd task-manager-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   or run with Node:

   ```bash
   node app.js
   ```

By default, the server runs on [http://localhost:3000](http://localhost:3000)

---

## 🛠 API Endpoints

### Create Task

```http
POST /tasks
```

Request body:

```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false
}
```

Response (201):

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false
}
```

---

### Get All Tasks

```http
GET /tasks
```

Response (200):

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false
  }
]
```

---

### Get Task by ID

```http
GET /tasks/:id
```

Response (200):

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "completed": false
}
```

Error (404):

```json
{ "success": false, "message": "Task not found" }
```

---

### Update Task

```http
PUT /tasks/:id
```

Request body:

```json
{
  "title": "Buy groceries and snacks",
  "description": "Milk, bread, eggs, chips",
  "completed": true
}
```

Response (200):

```json
{
  "id": 1,
  "title": "Buy groceries and snacks",
  "description": "Milk, bread, eggs, chips",
  "completed": true
}
```

Error (400):

```json
{ "success": false, "message": "Invalid data" }
```

---

### Delete Task

```http
DELETE /tasks/:id
```

Response (200):

```json
{
  "success": true,
  "deletedTask": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false
  }
}
```

Error (404):

```json
{ "success": false, "message": "Task not found" }
```

---

## 🧪 Running Tests

This project uses tap for testing.

Run all tests:

```bash
npm test
```

---

## 📂 Project Structure

```
task-manager-api/
├── app.js          # Express app with routes
├── task.json       # JSON database (tasks)
├── test/           # Test files
├── package.json
└── README.md
```

---

## ⚡ Notes

* Requires Node.js v18+
* Data is stored in `task.json` (no external database required)
* Port is set to 3000 by default

