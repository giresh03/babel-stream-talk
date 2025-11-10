# WebRTC Signaling Server

A simple WebSocket-based signaling server for peer-to-peer video calls with support for multiple participants in a room.

## Features

- Multi-peer room support (Zoom-like functionality)
- WebRTC signaling (offer/answer/ICE candidates)
- Real-time captions support
- Automatic room cleanup when empty
- Peer join/leave notifications

## Installation

```bash
cd server
npm install
```

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:8000`

## WebSocket Endpoints

### Signaling WebSocket
- **URL**: `ws://localhost:8000/ws/signaling`
- **Purpose**: Handles WebRTC signaling messages (offers, answers, ICE candidates)

### Captions WebSocket
- **URL**: `ws://localhost:8000/ws/captions/:roomId`
- **Purpose**: Handles real-time caption broadcasting for a specific room

## Protocol

### Client → Server Messages

#### Join Room
```json
{
  "type": "join-room",
  "roomId": "room123"
}
```

#### Offer
```json
{
  "type": "offer",
  "roomId": "room123",
  "peerId": "peer456",
  "data": { /* RTCSessionDescription */ }
}
```

#### Answer
```json
{
  "type": "answer",
  "roomId": "room123",
  "peerId": "peer456",
  "data": { /* RTCSessionDescription */ }
}
```

#### ICE Candidate
```json
{
  "type": "ice-candidate",
  "roomId": "room123",
  "peerId": "peer456",
  "data": { /* RTCIceCandidate */ }
}
```

### Server → Client Messages

#### Room Peers (sent on join)
```json
{
  "type": "room-peers",
  "roomId": "room123",
  "peers": ["peer1", "peer2"]
}
```

#### Peer Joined
```json
{
  "type": "peer-joined",
  "roomId": "room123",
  "peerId": "newPeer"
}
```

#### Peer Left
```json
{
  "type": "peer-left",
  "roomId": "room123",
  "peerId": "leftPeer"
}
```

## Environment Variables

You can configure the port by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

The server automatically uses `process.env.PORT` if available (required for Railway, Render, etc.)

## 🚀 Deployment

### Deploy to Railway

1. Go to https://railway.app
2. Sign up/login with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Set **Root Directory:** `server`
6. Deploy
7. Your WebSocket URL: `wss://your-app.up.railway.app`

### Deploy to Render

1. Go to https://render.com
2. **New +** → **Web Service**
3. Connect GitHub repo
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Deploy
6. Your WebSocket URL: `wss://your-app.onrender.com`

### Deploy to Heroku

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Deploy: `git subtree push --prefix server heroku main`
5. Your WebSocket URL: `wss://your-app-name.herokuapp.com`

## Production Configuration

For production, the server:
- ✅ Uses `PORT` environment variable (Railway/Render auto-provide this)
- ✅ Supports WebSocket Secure (WSS) automatically with HTTPS
- ✅ Handles multiple rooms concurrently
- ✅ Cleans up empty rooms automatically
- ✅ Works with any WebSocket client

**No additional configuration needed!**

## Notes

- The server uses in-memory storage for rooms (not persistent)
- Empty rooms are automatically deleted
- Each peer gets a unique ID assigned by the server
- The server broadcasts signaling messages between peers in the same room

