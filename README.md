# Indian Compliance Monitoring Platform – Base Setup

A platform for monitoring and managing Indian regulatory compliance requirements.

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+)
- Python 3.11+
- pip

## Quick Setup

Run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend (Port 8000)

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
npm run dev
```

### Start Frontend (Port 3000)

```bash
cd frontend
npm run dev
```

### Access the Application

Open http://localhost:3000 in your browser.

## Database Migrations

### Create a new migration

```bash
cd backend
source venv/bin/activate
npm run migrate:create "migration description"
```

### Apply migrations

```bash
npm run migrate:up
```

### Rollback last migration

```bash
npm run migrate:down
```

## Project Structure

```
├── backend/          # FastAPI backend
│   ├── app/          # Application code
│   ├── alembic/      # Database migrations
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── app/          # App router pages
│   └── lib/          # Utilities
└── docker-compose.yml # PostgreSQL setup
```

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: Next.js 14, TypeScript, TailwindCSS
- Database: PostgreSQL 15
