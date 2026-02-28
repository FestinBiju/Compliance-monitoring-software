# Indian Compliance Monitoring Platform – Base Setup

A platform for monitoring and managing Indian regulatory compliance requirements.

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+)
- Python 3.11+
- pip

## Quick Setup

### Linux/Mac

```bash
chmod +x setup.sh
./setup.sh
```

### Windows

```cmd
setup.bat
```

Or use Git Bash/WSL to run the Linux script.

## Manual Setup

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Setup Backend

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

**Windows:**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend (Port 8000)

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
npm run dev
```

**Windows:**
```cmd
cd backend
venv\Scripts\activate
npm run dev
```

The backend API will be available at http://localhost:8000

### Start Frontend (Port 5173)

```bash
cd frontend
npm run dev
```

### Access the Application

Open http://localhost:5173 in your browser.

The dashboard will now show live data from MeitY press releases!

## Database Migrations

### Create a new migration

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
npm run migrate:create "migration description"
```

**Windows:**
```cmd
cd backend
venv\Scripts\activate
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
├── frontend/         # React + Vite frontend
│   ├── src/          # Source code
│   │   ├── app/      # App components
│   │   ├── styles/   # CSS styles
│   │   └── main.tsx  # Entry point
│   └── index.html    # HTML template
└── docker-compose.yml # PostgreSQL setup
```

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React 18, Vite, TailwindCSS, Radix UI
- Database: PostgreSQL 15

## Monitoring MeitY Press Releases

The platform monitors press releases from the Ministry of Electronics and Information Technology (MeitY) for DPDP Act-related updates.

### How it works

The monitoring script (`backend/app/monitor.py`) uses the MeitY WordPress API to fetch press releases directly:

- API Endpoint: `https://www.meity.gov.in/cms/wp-json/document/documents`
- Returns English content by default (no language switching needed)
- Filters press releases for DPDP-related keywords
- No browser automation required

### Running the monitor

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app/monitor.py
```

### Testing

For testing the filtering logic with mock data:

```bash
python app/monitor_mock.py
```
