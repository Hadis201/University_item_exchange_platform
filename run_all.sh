#!/bin/bash

# Function to cleanup background processes
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting University Item Exchange Platform..."

# Start Backend
echo "📦 Starting Backend (Port 5000)..."
cd backend
npm run dev &
cd ..

# Start Web Frontend
echo "🌐 Starting Web Frontend (Port 5173)..."
cd sust-bikroi
npm run dev &
cd ..

# Start Mobile App
echo "📱 Starting Mobile App..."
cd sust-bikroi-mobile
# Using --no-interactive to avoid hanging if it asks for something, though 'android' usually just starts it.
npm run android &
cd ..

# Wait for all background processes
wait
