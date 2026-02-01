# TaskManager Full-Stack App

This repository contains a full-stack Task Manager application:

* **Backend:** .NET 8 Web API (`TaskManagerAPI`)
* **Frontend:** React + Vite (`task-manager-client`)
* **Worker:** .NET 8 Background Worker (`TaskWorker`)
* **Database:** SQL Server
* **Message Broker:** RabbitMQ
* **State Management:** Redux Toolkit (tasks)

## Prerequisites

Before running the project, make sure you have installed:

* [.NET 8 SDK](https://dotnet.microsoft.com/download)
* [Node.js 20+](https://nodejs.org/)
* SQL Server
* [Erlang](https://www.erlang.org/downloads) (required by RabbitMQ)
* [RabbitMQ](https://www.rabbitmq.com/download.html)

## Architecture Overview

The TaskManager app follows a full-stack architecture with separation between frontend, backend, and worker.

### Frontend (React + Vite)

* Uses **Redux Toolkit** for state management of tasks and tracks loading/error states.
* **Components:**

  * `TaskPage` – Displays list of tasks
  * `TaskForm` – Handles creating/updating tasks
  * `Loading` – Global loading indicator

### Authentication

* Users are identified via **local storage** (`userId` saved after login).
* Tasks are linked to the logged-in user using the stored `userId`.
* API requests are handled via **Axios**, with async actions in Redux (`createAsyncThunk`).

### Backend (.NET 8 Web API)

* Exposes RESTful endpoints for tasks (CRUD operations)
* Uses **Entity Framework Core** with SQL Server
* Implements DTOs for request/response objects
* Handles global errors with middleware
* Sends messages to **RabbitMQ** for background processing

### Worker (.NET 8 Background Worker)

* Listens to RabbitMQ queues
* Processes background tasks (e.g., sending notifications or scheduled updates)
* Runs independently from the backend API
* Uses the same database as the backend

### Database (SQL Server)

* **Tables:**

  * `Users` – stores user credentials and IDs
  * `Tasks` – stores task info (title, description, date, userId)
* **Relationships:** One-to-many (User → Tasks)

### Message Broker (RabbitMQ)

* Handles asynchronous communication between backend and worker
* Requires Erlang runtime to be installed
* Queues are used to send task processing jobs to the worker

## Setup Instructions

### Backend (TaskManagerAPI)

1. Navigate to the backend folder:

cd TaskManagerAPI

2. Restore NuGet packages:

dotnet restore

3. Apply database migrations (if needed):

dotnet tool install --global dotnet-ef   # only needed once
dotnet ef database update

4. Run the backend:

dotnet run

### Frontend (task-manager-client)

1. Navigate to the frontend folder:

cd task-manager-client

2. Install dependencies:

npm install

3. Run the frontend:

npm run dev

### Worker (TaskWorker)

1. Make sure **RabbitMQ** is installed and running:

   * Install Erlang first: [https://www.erlang.org/downloads](https://www.erlang.org/downloads)
   * Install RabbitMQ: [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)
   * Start RabbitMQ service

2. Navigate to the worker project folder:

cd TaskWorker

3. Restore NuGet packages:

dotnet restore

4. Run the worker:

dotnet run

**Now the backend can enqueue jobs, and the worker will process them asynchronously.**
