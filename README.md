# Babel Stream Talk - WebRTC Video Conferencing

A modern, Zoom-like video conferencing application with real-time AI-powered captions and translation support. Built with React, TypeScript, and WebRTC.

## ✨ Features

- 🎥 **Multi-participant video calls** - Support for multiple users in a single room (like Zoom)
- 🔗 **Easy link sharing** - Share room links to invite participants instantly
- 💬 **Real-time captions** - AI-powered speech-to-text with live captions
- 🌍 **Multi-language translation** - Automatic translation of captions to different languages
- 🎙️ **Audio/Video controls** - Toggle microphone and camera on/off
- 📊 **Responsive grid layout** - Automatically adapts to the number of participants
- 📥 **Transcript download** - Export call transcripts as JSON
- 🔄 **Auto-reconnection** - Automatic reconnection on connection loss
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd babel-stream-talk
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend server dependencies**
```bash
cd server
npm install
cd ..
```

### Running the Application

You need to run both the frontend and backend:

#### Terminal 1 - Backend Server (Signaling)
```bash
cd server
npm start
```
The server will start on `http://localhost:8000`

#### Terminal 2 - Frontend Application
```bash
npm run dev
```
The app will be available at `http://localhost:8080`

## 📖 How to Use

1. **Start a call**
   - Open the app at `http://localhost:8080`
   - Click "Create New Room" or enter a room ID to join an existing room

2. **Invite participants**
   - Click the "Copy Link" button in the call interface
   - Share the link with others to join your call
   - Anyone with the link can join the room

3. **During the call**
   - Toggle your microphone with the 🎤 button
   - Toggle your camera with the 📹 button
   - Change caption language using the language selector
   - Download transcript with the 📥 button
   - Leave the call with the 📞 button

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **WebRTC** for peer-to-peer video connections
- **WebSocket** for signaling and real-time communication
- **shadcn/ui** components for the UI
- **Tailwind CSS** for styling
- **Vite** for fast development and building

### Backend
- **Node.js** WebSocket server
- Custom signaling server for WebRTC peer connections
- Multi-room support with automatic cleanup
- In-memory room management

## 🔧 Configuration

### Backend URL

The frontend uses environment variables for backend configuration. Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=ws://localhost:8000
```

For production, use:
```env
VITE_BACKEND_URL=wss://your-backend-domain.com
```

### Server Port

To change the server port, edit `server/server.js`:
```javascript
const PORT = 8000; // Change to your desired port
```

## 🛠️ Development

### Project Structure
```
babel-stream-talk/
├── src/
│   ├── components/        # React components
│   │   ├── VideoCall.tsx  # Main video call component
│   │   ├── CaptionOverlay.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── pages/             # Route pages
│   ├── utils/             # Utility functions
│   │   ├── webrtc.ts      # WebRTC manager (multi-peer support)
│   │   └── websocket.ts   # WebSocket manager with reconnection
│   └── config/            # Configuration
├── server/                # Backend signaling server
│   ├── server.js          # WebSocket server
│   └── package.json
└── public/
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start the signaling server
- `npm run dev` - Start with auto-reload (Node.js --watch)

## 🐛 Troubleshooting

### Camera/Microphone Not Working
- Ensure you've granted browser permissions for camera and microphone
- Check if another application is using the camera/microphone
- Try using HTTPS (required for some browsers in production)

### Connection Failed
- Ensure the backend server is running on `http://localhost:8000`
- Check browser console for detailed error messages
- Verify firewall settings aren't blocking WebSocket connections

### Peer Not Connecting
- Both peers must be connected to the signaling server
- Check that STUN servers are accessible
- For production, you may need a TURN server for NAT traversal

## 🌐 Deployment

### Frontend (Lovable)
Simply open [Lovable](https://lovable.dev/projects/8db550c9-f722-4aa7-a044-179563794a8b) and click on Share → Publish.

### Backend Server
Deploy the `server/` directory to any Node.js hosting provider:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2/Lambda

Make sure to:
1. Set the appropriate PORT environment variable
2. Use WSS (WebSocket Secure) for production
3. Update `VITE_BACKEND_URL` in your frontend environment

## 🔐 Security Considerations

- Always use HTTPS/WSS in production
- Implement authentication for room access if needed
- Consider adding TURN servers for production reliability
- Implement rate limiting on the signaling server
- Add room password protection for sensitive calls

## 🤝 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **WebRTC** - Real-time video/audio communication
- **WebSocket** - Signaling and real-time messaging
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icons
- **Node.js** - Backend runtime
- **ws** - WebSocket library for Node.js

## 📝 License

This project is built with Lovable and is available for modification and distribution.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Ensure both frontend and backend are running
- Verify network connectivity and firewall settings

---

Made with ❤️ using Lovable
