# 🚀 Setup Guide - Babel Stream Talk

This guide will help you set up and run the video conferencing application locally.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Camera and microphone permissions

## Step-by-Step Setup

### Option 1: Quick Start (Recommended)

Use the provided start script to run everything automatically:

```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the application
./start.sh
```

The script will:
1. Install all dependencies (if needed)
2. Start the backend server on `http://localhost:8000`
3. Start the frontend on `http://localhost:8080`

Then open your browser to `http://localhost:8080`

### Option 2: Manual Setup

If you prefer to run services separately:

#### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

#### 2. Start the Backend Server

Open a terminal and run:
```bash
cd server
npm start
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║  WebRTC Signaling Server                                 ║
║  Running on http://localhost:8000                        ║
╚══════════════════════════════════════════════════════════╝
```

**Keep this terminal running!**

#### 3. Start the Frontend

Open a **new terminal** and run:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

#### 4. Open the Application

Navigate to `http://localhost:8080` in your browser.

## 🎥 Testing the Video Call

### Testing Locally with Multiple Participants

To test the multi-participant feature on a single computer:

1. **Open the first browser window:**
   - Go to `http://localhost:8080`
   - Click "Create New Room"
   - You'll be taken to a room (e.g., `http://localhost:8080/room/abc123`)
   - Click "Copy Link" to copy the room URL

2. **Open a second browser window (or incognito/private mode):**
   - Paste the room URL or go to `http://localhost:8080`
   - Enter the same room ID (`abc123`) and click "Join Room"
   - Grant camera/microphone permissions

3. **Both participants should now be connected!**
   - You'll see yourself in one video box
   - The other participant in another video box
   - Test the audio/video controls
   - Try the caption features

### Testing with Real Remote Participants

1. **Ensure both computers can reach the server:**
   - Find your local IP address:
     - macOS/Linux: `ifconfig | grep inet`
     - Windows: `ipconfig`
   - Example: `192.168.1.100`

2. **Update the backend URL for remote access:**
   - Create or edit `.env` file in the project root:
   ```env
   VITE_BACKEND_URL=ws://192.168.1.100:8000
   ```
   - Restart the frontend: `npm run dev`

3. **Share your room link:**
   - Create a room and copy the link
   - Share it with others on the same network
   - They can join by pasting the link in their browser

## 🔧 Configuration

### Changing the Backend Port

Edit `server/server.js`:
```javascript
const PORT = 8000; // Change to your preferred port
```

Then update the `.env` file:
```env
VITE_BACKEND_URL=ws://localhost:YOUR_NEW_PORT
```

### Using a Custom Backend URL

For production or custom setups, create a `.env` file:

```env
# For local development
VITE_BACKEND_URL=ws://localhost:8000

# For production (use secure WebSocket)
# VITE_BACKEND_URL=wss://your-backend.com
```

## ✅ Verification Checklist

- [ ] Node.js installed (check with `node --version`)
- [ ] Dependencies installed (frontend and backend)
- [ ] Backend server running on port 8000
- [ ] Frontend running on port 8080
- [ ] Browser can access `http://localhost:8080`
- [ ] Camera and microphone permissions granted
- [ ] WebSocket connection established (check browser console)

## 🐛 Troubleshooting

### "Cannot access camera/microphone"
**Solution:**
- Grant permissions in your browser settings
- Make sure no other app is using the camera
- Try reloading the page
- Use HTTPS in production (HTTP works for localhost)

### "Failed to connect to signaling server"
**Solution:**
- Ensure the backend server is running (`cd server && npm start`)
- Check that port 8000 is not in use by another application
- Look at the server terminal for error messages
- Check your `.env` file for the correct backend URL

### "Peer not connecting"
**Solution:**
- Make sure both users are in the same room
- Check that both clients can reach the signaling server
- Look at browser console for WebRTC errors
- Ensure firewall isn't blocking WebSocket connections

### Port Already in Use
**Solution:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port (see Configuration section)
```

### Build Errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear server cache
cd server
rm -rf node_modules package-lock.json
npm install
```

## 🧪 Testing Checklist

After setup, verify these features work:

- [ ] Create a new room
- [ ] Join an existing room by ID
- [ ] Copy room link
- [ ] See your own video feed
- [ ] Toggle microphone on/off
- [ ] Toggle camera on/off
- [ ] Connect with a second participant
- [ ] See multiple video streams
- [ ] Participant counter updates correctly
- [ ] Leave call functionality
- [ ] Download transcript (if captions available)

## 📚 Next Steps

After successful setup:

1. **Explore the code:**
   - `src/components/VideoCall.tsx` - Main video call component
   - `src/utils/webrtc.ts` - WebRTC connection management
   - `src/utils/websocket.ts` - WebSocket signaling
   - `server/server.js` - Backend signaling server

2. **Customize the application:**
   - Modify UI in the components
   - Add authentication
   - Implement recording features
   - Add chat functionality

3. **Deploy to production:**
   - See README.md for deployment instructions
   - Remember to use WSS (secure WebSocket) in production
   - Consider using TURN servers for better connectivity

## 🆘 Need Help?

- Check the [README.md](README.md) for more information
- Review the [server documentation](server/README.md)
- Check browser console for error messages
- Ensure all prerequisites are met

## 🎉 Success!

If you can see yourself on video and connect with another participant, you're all set! 

Enjoy your video calls! 🎥✨

