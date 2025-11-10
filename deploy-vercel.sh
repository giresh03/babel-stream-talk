#!/bin/bash

# Quick Vercel Deployment Script

echo "🚀 Deploying to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "⚠️  IMPORTANT: Before deploying frontend, make sure you have:"
echo "   1. Deployed the backend to Railway or Render"
echo "   2. Got the backend WebSocket URL (wss://...)"
echo ""

read -p "Have you deployed the backend and have the WebSocket URL? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "❌ Please deploy the backend first!"
    echo ""
    echo "📖 Quick Backend Deployment:"
    echo "   1. Go to https://railway.app or https://render.com"
    echo "   2. Sign up/login with GitHub"
    echo "   3. Create new project from your GitHub repo"
    echo "   4. Set root directory to 'server'"
    echo "   5. Deploy and get the URL"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
read -p "Enter your backend WebSocket URL (wss://your-backend.com): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL cannot be empty!"
    exit 1
fi

# Validate URL format
if [[ ! $BACKEND_URL =~ ^wss:// ]]; then
    echo "⚠️  Warning: URL should start with wss:// for production"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔧 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "☁️  Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Frontend deployed successfully!"
    echo ""
    echo "🔧 Now setting environment variable..."
    
    # Set environment variable
    echo "$BACKEND_URL" | vercel env add VITE_BACKEND_URL production
    
    echo ""
    echo "🔄 Redeploying with environment variable..."
    vercel --prod
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo ""
    echo "📋 Your app is now live!"
    echo "   Frontend: Check the URL above"
    echo "   Backend: $BACKEND_URL"
    echo ""
    echo "✅ Test your deployment:"
    echo "   1. Open the Vercel URL"
    echo "   2. Create a room"
    echo "   3. Share the link"
    echo "   4. Test with multiple devices"
    echo ""
else
    echo "❌ Deployment failed!"
    echo "Check the error messages above."
    exit 1
fi

