#!/bin/bash

echo "🔍 Checking Service Status..."
echo ""

# Check backend
if lsof -i :8000 > /dev/null 2>&1; then
    echo "✅ Backend server is running on port 8000"
    curl -s http://localhost:8000 | head -1
else
    echo "❌ Backend server is NOT running"
    echo "   Start with: cd server && npm start"
fi

echo ""

# Check frontend
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 8080"
else
    echo "❌ Frontend server is NOT running"
    echo "   Start with: npm run dev"
fi

echo ""
echo "📍 Access the app at: http://localhost:8080"
echo ""

