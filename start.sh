#!/bin/bash

# Babel Stream Talk - Start Script
# This script starts both the backend server and frontend application

echo "🚀 Starting Babel Stream Talk..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${BLUE}📦 Installing server dependencies...${NC}"
    (cd server && npm install)
fi

# Check if ports are already in use
if lsof -i :8000 > /dev/null 2>&1; then
    echo -e "${RED}⚠️  Port 8000 is already in use. Killing existing process...${NC}"
    lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -i :8080 > /dev/null 2>&1; then
    echo -e "${RED}⚠️  Port 8080 is already in use. Killing existing process...${NC}"
    lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
    sleep 1
fi

echo ""
echo -e "${GREEN}✅ Starting backend server on http://localhost:8000${NC}"
echo -e "${GREEN}✅ Starting frontend on http://localhost:8080${NC}"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Start backend server in background
(cd server && npm start) &
SERVER_PID=$!

# Wait a bit for server to start
sleep 3

# Start frontend
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${RED}🛑 Shutting down services...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Also kill by port in case PIDs don't work
    lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
    lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Wait for both processes
wait
