# To-Do Reminder App

This is a full-stack To-Do Reminder App built with a React frontend and a FastAPI backend. The data is stored in MongoDB Atlas. The app allows users to create workspaces, add tasks with due dates and priorities, and manage their to-do lists collaboratively.

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

## Features

- Create and manage tasks with titles, descriptions, due dates, and priority levels.
- User authentication through workspaces with password protection.
- Real-time task updates and collaborative features.
- Sorting and filtering of tasks based on priority and due dates.
- Responsive design suitable for desktop and mobile devices.

## Live Demo

The application is deployed and running at [https://to-do-task-manager-mu.vercel.app](https://to-do-task-manager-mu.vercel.app). Please wait approximately **2 minutes** for the backend server to start if it's in sleep mode.

If you want to test only the backend APIs, you can visit [https://backend-todo-taskmanager.onrender.com](https://backend-todo-taskmanager.onrender.com).

## Getting Started

### Prerequisites

- **Node.js** (v14 or newer)
- **Python** (v3.8 or newer)
- **MongoDB** database (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud database)

### Setup Instructions

#### Backend Setup

1. **Clone the Repository**

   ```cmd
   git clone https://github.com/yourusername/To-Do-Reminder-App.git
   cd To-Do-Reminder-App\backend
   ```

2. **Create a Virtual Environment**

   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Dependencies**

   ```cmd
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

##### Using MongoDB Atlas

This app currently uses MongoDB Atlas to store data. If you want to store data on the local machine, please follow the below steps.

##### **Using Local MongoDB**

If you prefer to run MongoDB on your local machine instead of using MongoDB Atlas, follow these steps:

1. **Download and Install MongoDB:**

   - Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the **MongoDB Community Server** for Windows.
   - Run the installer and follow the setup instructions. During installation, choose the option to install MongoDB as a **Windows Service** for easier management.

2. **Start MongoDB:**

   - If you installed MongoDB as a service, it should start automatically. If not, you can start it manually via Command Prompt:
   
     ```cmd
     net start MongoDB
     ```
   
   - To verify that MongoDB is running, open Command Prompt and enter:
   
     ```cmd
     mongo
     ```
   
     This should connect you to the MongoDB shell.

3. **Configure Environment Variables:**

   - Update your `.env` file in the `backend` directory with the following content:
   
     ```properties
     MONGODB_URL=mongodb://localhost:27017
     DATABASE_NAME=todo_db
     SECRET_KEY=your_secret_key
     CORS_ORIGINS=*
     ```
   
     Ensure that `MONGODB_URL` points to your local MongoDB instance.

5. **Run the Backend Server**

   ```cmd
   uvicorn app.main:app --reload
   ```

   The backend will be running on `http://localhost:8000`.

#### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```cmd
   cd ..\frontend
   ```

2. **Install Dependencies**

   ```cmd
   npm install
   ```

3. **Run the Frontend Server**

   ```cmd
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

Comprehensive test cases are implemented to ensure the reliability and correctness of the deployed backend APIs.

### Prerequisites for Testing

- Ensure the backend server is running and accessible at the specified `BASE_URL`.
- Install the required Python packages if not already installed:

  ```cmd
  pip install -r requirements.txt
  ```

### Running the Tests

1. **Navigate to the Backend Directory**

   ```cmd
   cd backend
   ```

2. **Activate the Virtual Environment**

   ```cmd
   call .venv\Scripts\activate
   ```

3. **Run the Test Suite Using Pytest**

   ```cmd
   pytest tests/test_deployed_server.py
   ```

   This command will execute all the test cases defined in `test_deployed_server.py`, covering various scenarios such as workspace creation, authentication, todo management, and input validation.

### Understanding the Test Cases

- **Workspace Tests:**
  - **`test_create_workspace_success`**: Verifies successful creation of a new workspace.
  - **`test_create_workspace_duplicate`**: Ensures that creating a workspace with an existing name fails.
  - **`test_login_workspace`**: Tests successful login to an existing workspace.
  - **`test_login_workspace_incorrect_password`**: Checks that login fails with incorrect credentials.

- **Todo Tests:**
  - **`test_create_todo_success`**: Validates successful creation of a new todo item.
  - **`test_create_todo_nonexistent_workspace`**: Ensures that creating a todo in a non-existent workspace fails.
  - **`test_get_todos_empty_workspace`**: Checks that retrieving todos from an empty workspace returns an empty list.
  - **`test_update_todo_success`**: Verifies successful updating of an existing todo.
  - **`test_update_todo_nonexistent`**: Ensures that updating a non-existent todo fails.
  - **`test_delete_todo_success`**: Validates successful deletion of an existing todo.
  - **`test_delete_todo_nonexistent`**: Checks that deleting a non-existent todo fails.
  - **`test_input_validation_missing_fields`**: Tests input validation by omitting required fields.
  - **`test_input_validation_invalid_data_types`**: Ensures that invalid data types in the request payload are handled correctly.
 
## Samples of the App:
![image](https://github.com/user-attachments/assets/b92fd7fd-5cb7-465e-ba16-849248e74aa7)
![image](https://github.com/user-attachments/assets/32dc0f51-fdba-4d1a-8a87-19903a0606f5)
![image](https://github.com/user-attachments/assets/21266723-b9cc-4684-aa72-fe9a5659f6c0)
![image](https://github.com/user-attachments/assets/df805e2f-b48d-4803-9578-2e2e943ced7d)




## Keep-Alive Mechanism

To prevent the backend server from going to sleep, a keep-alive mechanism has been implemented in the frontend. This involves sending a simple GET request to the backend every 8 minutes.

Since Render spins down the server due to inactivity on free-tier hosting, the frontend sends GET requests every 8 minutes to keep the backend active.





