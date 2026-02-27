#!/bin/bash

echo "🚀 Setting up Indian Compliance Monitoring Platform..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ All prerequisites are installed"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL database..."
docker-compose up -d
sleep 3
echo "✅ PostgreSQL is running on port 5433"
echo ""

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "✅ Backend setup complete"
cd ..
echo ""

# Setup Frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"
cd ..
echo ""

echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start backend (in backend folder):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   npm run dev"
echo ""
echo "2. Start frontend (in frontend folder, new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Visit http://localhost:5173"
echo ""
echo "To run migrations:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   npm run migrate:create \"migration name\""
echo "   npm run migrate:up"
