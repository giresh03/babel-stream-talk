# ⚡ Quick Start Guide

Get your video call app running in 3 minutes!

## 🚀 One-Command Start

```bash
./start.sh
```

That's it! Open `http://localhost:8080` in your browser.

---

## 📋 Manual Start (If script doesn't work)

### Terminal 1 - Backend
```bash
cd server
npm install    # First time only
npm start
```

### Terminal 2 - Frontend  
```bash
npm install    # First time only
npm run dev
```

### Open Browser
Go to: `http://localhost:8080`

---

## 🎥 Testing Video Call

### Test with 2 Windows on Same Computer:

1. **Window 1:** `http://localhost:8080` → Click "Create New Room"
2. **Window 2:** Open incognito/private mode → Paste the room URL
3. Grant camera/mic permissions in both
4. ✅ You should now see both video feeds!

### Test with Friends:

1. Create a room and click "Copy Link"
2. Share the link with friends
3. They open the link and join
4. Everyone can see everyone! 🎉

---

## ✅ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't access camera | Grant permissions in browser settings |
| Connection failed | Make sure backend server is running (`cd server && npm start`) |
| Port in use | Kill process: `lsof -i :8000` then `kill -9 PID` |
| Build errors | `rm -rf node_modules && npm install` |

---

## 📖 Features

- ✨ Multiple participants (like Zoom)
- 🔗 Share room links to invite people
- 🎤 Toggle audio/video
- 💬 Real-time captions & translation
- 📥 Download transcripts
- 🎨 Beautiful modern UI

---

## 🆘 Need More Help?

- Detailed setup: [SETUP.md](SETUP.md)
- Full documentation: [README.md](README.md)
- Server info: [server/README.md](server/README.md)

---

**That's all! Happy video calling! 🎥✨**

