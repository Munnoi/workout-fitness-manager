# FitLife Gym Management System

Welcome to FitLife, a comprehensive Gym Management System designed to help users track their fitness journey, browse workout programs, and record their progress. The system consists of a Django-based backend API and a React.js frontend application.

## Features

### Customer Functionalities
*   **User Management**: Register, login, logout, and change password.
*   **Personalized Dashboard**: View current active workout plan and today's exercises.
*   **Workout Library**: Browse a wide range of workout programs and enroll in one.
*   **Active Workout Session**: Start a workout session, view exercise instructions, mark exercises as completed or skipped, and automatically update progress.
*   **Progress Tracking**: View a detailed history of completed workouts, including dates and basic statistics.
*   **Profile Management**: Edit personal information and fitness goals.

### Admin Functionalities (Frontend)
*   **Admin Dashboard**: Overview of platform statistics (total users, active users, pending messages, etc.).
*   **User Management**: View, block, and delete user accounts.
*   **Exercise Management**: Create, edit, and delete exercises.
*   **Program Management**: Create, edit, and delete workout programs, including assigning exercises to program days.
*   **Message Management**: View and reply to contact messages from users.

### Theming
*   **Dark/Light Mode Toggle**: The frontend application supports switching between dark and light themes, with user preference saved automatically.

## Technology Stack

### Backend
*   **Django**: Web framework
*   **Django REST Framework**: For building RESTful APIs
*   **PostgreSQL**: Database (defaulted to Supabase, but configurable)
*   **`python-dotenv`**: For managing environment variables
*   **`psycopg2`**: PostgreSQL adapter

### Frontend
*   **React.js**: JavaScript library for building user interfaces
*   **Vite**: Frontend tooling (build tool, dev server)
*   **Tailwind CSS**: Utility-first CSS framework for styling
*   **`react-router-dom`**: For declarative routing
*   **`react-icons`**: For SVG icons
*   **`framer-motion`**: For animations
*   **`recharts`**: For charting and data visualization

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn
*   Python (3.11+ recommended)
*   pip (Python package installer)
*   `venv` (Python virtual environment)
*   Docker and Docker Compose (optional, but recommended for easy setup)

### Local Setup (Without Docker)

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/gym-management-system.git
cd gym-management-system
```

#### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory based on `.env.example`.
```ini
# backend/.env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
# Database (Supabase PostgreSQL or local)
# If using Supabase, replace with your actual connection string
# Otherwise, comment this out to use SQLite (default fallback)
DATABASE_URL="postgresql://user:password@host:port/dbname" 

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```
**Important:** If `DATABASE_URL` is commented out or missing, Django will use a local SQLite database (`db.sqlite3`).

Run migrations to set up your database:
```bash
python manage.py makemigrations
python manage.py migrate
```

(Optional) Seed initial data:
```bash
python manage.py seed_data
```

Create a superuser for admin access:
```bash
python manage.py createsuperuser
```

Start the Django backend server:
```bash
python manage.py runserver
```
The backend API will be available at `http://localhost:8000`.

#### 3. Frontend Setup

```bash
cd ../frontend
npm install # or yarn install
```

Create a `.env` file in the `frontend/` directory if you need to override the API URL (e.g., if your backend is on a different host).
```ini
# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

Start the React frontend development server:
```bash
npm run dev # or yarn dev
```
The frontend application will be available at `http://localhost:5173`.

### Docker Setup (Recommended)

Ensure Docker and Docker Compose are installed and running on your system.

#### 1. Build and run services

Navigate to the project root directory (where `docker-compose.yml` is located) and run:
```bash
docker-compose up --build
```
This command will:
*   Build the `backend` and `frontend` Docker images.
*   Start the Django backend container (listening on `http://localhost:8000`).
*   Run database migrations within the backend container.
*   Start the React frontend development server within its container (listening on `http://localhost:5173`).

#### 2. Access the application

*   **Frontend**: Open your browser to `http://localhost:5173`
*   **Backend API**: `http://localhost:8000/api`
*   **Django Admin**: `http://localhost:8000/admin` (You'll need to create a superuser first if running for the first time).

#### 3. Creating a Superuser (if not done previously or if database is new)

If you're using a new database or haven't created a superuser, you can do so by running a command in the backend service:
```bash
docker-compose exec backend python manage.py createsuperuser
```

#### 4. Seeding Data (if not done previously or if database is new)

To seed dummy exercises and programs:
```bash
docker-compose exec backend python manage.py seed_data
```

#### 5. Stop services

To stop the Docker containers, run:
```bash
docker-compose down
```

## Admin Access

Once you have created a superuser (via `python manage.py createsuperuser` or `docker-compose exec backend python manage.py createsuperuser`), you can log in to the Django Admin panel at `http://localhost:8000/admin` with your superuser credentials.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details (if one exists).
