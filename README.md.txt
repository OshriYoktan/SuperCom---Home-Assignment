# TaskManager Full-Stack App

This repository contains a full-stack Task Manager application:

- **Backend:** .NET 8 Web API (`TaskManagerAPI`)
- **Frontend:** React + Vite (`task-manager-client`)
- **Database:** SQL Server
- **State Management:** Redux Toolkit (tasks)

---

## Prerequisites

Before running the project, make sure you have installed:

- .NET 8 SDK
- Node.js 20+
- SQL Server

---

## Architecture Overview

The TaskManager app follows a full-stack architecture with separation between frontend and backend:

### Frontend (React + Vite)

- Uses Redux Toolkit for state management of tasks and tracks loading and error states.
- **Components:**
  - `TaskPage` – Displays list of tasks
  - `TaskForm` – Handles creating/updating tasks
  - `Loading` – Global loading indicator

### Authentication

- Users are identified via **local storage** (`userId` saved after login).
- Tasks are linked to the logged-in user using the stored `userId`.
- API requests are handled via **Axios**, with async actions in Redux (`createAsyncThunk`).

### Backend (.NET 8 Web API)

- Exposes RESTful endpoints for tasks (CRUD operations)
- Uses Entity Framework Core with SQL Server
- Implements DTOs for request/response objects
- Handles global errors with middleware

### Database (SQL Server)

- **Tables:**
  - `Users` – stores user credentials and IDs (optional, if implementing registration)
  - `Tasks` – stores task info (title, description, date, userId)
- **Relationships:** One-to-many (User → Tasks)

---

## Setup Instructions

### Backend (TaskManagerAPI)

1. Navigate to backend folder:  
cd TaskManagerAPI

2. Restore packages and apply EF migrations:
dotnet tool install --global dotnet-ef   # if not installed
dotnet restore
dotnet ef database update
3. Run the project:
dotnet run

## Frontend (task-manager-client)

1. Navigate to frontend folder:  
cd task-manager-client

2. Install dependencies:
npm install

3.Run the frontend:
npm run dev


