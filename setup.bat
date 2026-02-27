@echo off
echo Setting up Indian Compliance Monitoring Platform...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3 first.
    exit /b 1
)

echo All prerequisites are installed
echo.

REM Start PostgreSQL
echo Starting PostgreSQL database...
docker-compose up -d
timeout /t 3 /nobreak >nul
echo PostgreSQL is running on port 5433
echo.

REM Setup Backend
echo Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

echo Backend setup complete
cd ..
echo.

REM Setup Frontend
echo Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

echo Frontend setup complete
cd ..
echo.

echo Setup complete!
echo.
echo To start the application:
echo.
echo 1. Start backend (in backend folder):
echo    cd backend
echo    venv\Scripts\activate
echo    npm run dev
echo.
echo 2. Start frontend (in frontend folder, new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Visit http://localhost:3000
echo.
echo To run migrations:
echo    cd backend
echo    venv\Scripts\activate
echo    npm run migrate:create "migration name"
echo    npm run migrate:up
echo.
pause
