
# To-Do Reminder App

This is a full-stack To-Do Reminder App built with a React frontend and a FastAPI backend. The app allows users to create workspaces, add tasks with due dates and priorities, and manage their to-do lists collaboratively.

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [Todo APIs](#todo-apis)
- [Testing](#testing)
  - [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and manage tasks with titles, descriptions, due dates, and priority levels.
- User authentication through workspaces with password protection.
- Real-time task updates and collaborative features.
- Sorting and filtering of tasks based on priority and due dates.
- Responsive design suitable for desktop and mobile devices.

## Live Demo

The application is deployed and running at [www.frontendfull.com](http://www.frontendfull.com). Please wait approximately **2 minutes** for the backend server to start if it's in sleep mode.

If you want to test only the backend APIs, you can visit [www.backend.com](http://www.backend.com).

## Getting Started

### Prerequisites

- **Node.js** (v14 or newer)
- **Python** (v3.8 or newer)
- **MongoDB** database (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud database)
- **Git** (for cloning the repository)
- **Postman** (for testing APIs)

### Setup Instructions

#### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/To-Do-Reminder-App.git
   cd To-Do-Reminder-App/backend
   ```

2. **Create a Virtual Environment**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory with the following content:

   ```properties
   MONGODB_URL=your_mongodb_connection_string
   DATABASE_NAME=todo_db
   SECRET_KEY=your_secret_key
   CORS_ORIGINS=*
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB connection string. Replace `your_secret_key` with a secure, random string.

5. **Run the Backend Server**

   ```bash
   uvicorn app.main:app --reload
   ```

   The backend will be running on `http://localhost:8000`.

#### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Frontend Server**

   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173`.

## API Documentation

### Authentication APIs

#### **Create Workspace**

- **Endpoint:** `/workspaces/`
- **Method:** `POST`
- **Description:** Creates a new workspace.
- **Request Body:**

  ```json
  {
    "name": "workspace_name",
    "password": "password123"
  }
  ```

- **Example using Postman:**

  - Set method to `POST`.
  - URL: `http://localhost:8000/workspaces/`
  - Body tab: Select `JSON` format and paste the request body.

#### **Login to Workspace**

- **Endpoint:** `/workspaces/login`
- **Method:** `POST`
- **Description:** Logs into an existing workspace.
- **Request Body:**

  ```json
  {
    "name": "workspace_name",
    "password": "password123"
  }
  ```

### Todo APIs

#### **Get All Todos**

- **Endpoint:** `/todos/{workspace}`
- **Method:** `GET`
- **Description:** Retrieves all todos for a specific workspace.
- **Parameters:**
  - `workspace` (path parameter): The name of the workspace.

#### **Create Todo**

- **Endpoint:** `/todos/`
- **Method:** `POST`
- **Description:** Creates a new todo item.
- **Request Body:**

  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "due_date": "2023-12-31T00:00:00",
    "priority": "medium",
    "workspace": "workspace_name"
  }
  ```

#### **Update Todo**

- **Endpoint:** `/todos/{todo_id}`
- **Method:** `PUT`
- **Description:** Updates an existing todo item.
- **Parameters:**
  - `todo_id` (path parameter): The ID of the todo item.
- **Request Body:** (Any of the fields can be updated)

  ```json
  {
    "title": "Buy groceries and fruits",
    "completed": true
  }
  ```

#### **Delete Todo**

- **Endpoint:** `/todos/{todo_id}`
- **Method:** `DELETE`
- **Description:** Deletes a todo item.
- **Parameters:**
  - `todo_id` (path parameter): The ID of the todo item.

## Testing

It is mandatory to write test cases for each of the APIs developed.

### Running Tests

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

2. **Install Test Dependencies**

   Make sure you have `pytest` installed:

   ```bash
   pip install pytest pytest-asyncio
   ```

3. **Run Tests**

   ```bash
   pytest
   ```

### Test Cases

Test cases are located in the `tests` directory within the backend:

- `/backend/tests/test_main.py`

**Examples of Test Cases:**

- Test creating a workspace with valid data.
- Test creating a workspace with an existing name.
- Test logging into a workspace with correct credentials.
- Test logging into a workspace with incorrect credentials.
- Test creating a todo item with valid data.
- Test retrieving todos for a workspace.
- Test updating a todo item.
- Test deleting a todo item.
- Test accessing todos for a non-existent workspace.
- Test input validation (e.g., missing required fields, invalid data types).

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any feature requests or bugs.

## License

This project is licensed under the [MIT License](LICENSE).
