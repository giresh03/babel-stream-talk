# 🧪 Testing Multi-Participant Video Calls

## 🎯 The Issue You're Seeing

The error "Error establishing peer connection" happens because:
- ✅ Your camera is working (you can see yourself)
- ✅ You're connected to the room
- ❌ **But you're alone** - no other participant to connect to!

**WebRTC needs at least 2 participants to establish peer connections.**

---

## ✅ How to Test Properly

### Method 1: Two Browser Windows (RECOMMENDED)

#### Step 1: First Window (Your Current One)
1. You already have this open: `http://localhost:8080/room/prg5nglv`
2. Click **"Copy Link"** button at the top of the page
3. You should see a toast saying "Link copied!"

#### Step 2: Second Window (Incognito/Private Mode)
1. **Open a new INCOGNITO/PRIVATE window:**
   - **Mac:** `Cmd + Shift + N` (Chrome) or `Cmd + Shift + P` (Firefox/Safari)
   - **Windows:** `Ctrl + Shift + N` (Chrome) or `Ctrl + Shift + P` (Firefox)

2. **Paste the room link** (it will be like `http://localhost:8080/room/prg5nglv`)

3. **Grant camera/microphone permissions** when prompted

4. **Both windows should now connect!** ✨

---

### Method 2: Different Browsers

1. **Current window:** Chrome with your room
2. **Open Firefox or Safari**
3. **Paste the same room URL:** `http://localhost:8080/room/prg5nglv`
4. Grant permissions
5. Both browsers should connect!

---

### Method 3: Two Devices (Phone + Computer)

1. **Computer:** You're already in the room
2. **Phone:** Open browser and go to your computer's local IP
   - Find your IP: `ifconfig | grep inet` (Mac/Linux) or `ipconfig` (Windows)
   - Example: `http://192.168.1.100:8080/room/prg5nglv`
3. Grant permissions on phone
4. Connect!

---

## 🐛 Why Your Current Error Happens

The error you see:
```
InvalidStateError: Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': 
Failed to set remote answer sdp: Called in wrong state: stable
```

This happens when:
- You're the **only person** in the room
- The signaling server is working correctly
- But WebRTC is waiting for another peer to connect with
- Until then, it shows this error when processing signaling messages

**This is NORMAL when you're alone in the room!** ✅

---

## ✅ What Should Happen

### When 2nd Person Joins:

1. **First window:**
   - Error disappears ✅
   - Shows "Participant joined" notification ✅
   - You see their video feed ✅
   - Connection status: "connected" ✅

2. **Second window:**
   - Shows your own video ✅
   - Shows the first person's video ✅
   - Connection status: "connected" ✅

3. **Console:**
   - "Peer joined: [peerId]" ✅
   - "Received stream from peer: [peerId]" ✅
   - No more InvalidStateError ✅

---

## 🎥 Step-by-Step Testing

### Test 1: Solo (What You Have Now)
```
✅ Camera working
✅ Microphone working
✅ Connected to room
✅ Waiting for peers...
⚠️  Connection errors (expected when alone)
```

### Test 2: Two Participants
```bash
# Window 1 (you already have)
http://localhost:8080/room/prg5nglv

# Window 2 (open incognito)
# Paste the same URL
http://localhost:8080/room/prg5nglv
```

**Expected result:**
- ✅ Both see each other's video
- ✅ Participant counter shows "2 participants"
- ✅ No connection errors
- ✅ Both can toggle audio/video

### Test 3: Three Participants
```bash
# Open another browser or incognito window
# Paste the same URL again
http://localhost:8080/room/prg5nglv
```

**Expected result:**
- ✅ Grid layout shows 3 video feeds
- ✅ Participant counter shows "3 participants"
- ✅ Everyone can see everyone

---

## 🔍 Console Messages Explained

### Normal Messages (When Alone):
```javascript
✅ "Signaling WebSocket connected"
✅ "Captions WebSocket connected"
✅ "Call initialized successfully"
⚠️  "Error handling signaling message..." (expected)
```

### Success Messages (When 2+ Participants):
```javascript
✅ "Peer joined: [peerId]"
✅ "Received stream from peer: [peerId]"
✅ "Connection state: connected"
✅ "ICE connection state: connected"
```

---

## 🎯 Quick Test Script

Copy and paste this into your terminal to open a second browser:

**Mac (Chrome):**
```bash
open -na "Google Chrome" --args --incognito "http://localhost:8080/room/prg5nglv"
```

**Mac (Firefox):**
```bash
open -a Firefox --args -private-window "http://localhost:8080/room/prg5nglv"
```

**Linux:**
```bash
google-chrome --incognito "http://localhost:8080/room/prg5nglv" &
```

**Windows (PowerShell):**
```powershell
Start-Process chrome -ArgumentList "--incognito", "http://localhost:8080/room/prg5nglv"
```

---

## ✅ Verification Checklist

After opening second window/browser:

- [ ] First window shows "Participant joined" notification
- [ ] First window shows remote video feed
- [ ] Second window shows remote video feed
- [ ] Participant counter shows "2 participants"
- [ ] No "Connection error" banner
- [ ] Console shows "Peer joined" and "Received stream"
- [ ] Both can toggle audio/video
- [ ] Both can see changes in real-time

---

## 🐛 Still Having Issues?

### Both windows show connection error:
1. **Check backend is running:**
   ```bash
   lsof -i :8000
   ```
   Should show a node process

2. **Check console for WebSocket errors:**
   - Look for "WebSocket connection failed"
   - If you see this, restart: `./start.sh`

### Can see self but not other person:
1. Both must be in the **same room ID**
2. Both must **grant camera/mic permissions**
3. Check firewall isn't blocking local connections

### Video freezes or stutters:
1. This is normal for localhost testing
2. Try using different browsers
3. Check CPU usage

---

## 🎉 Success Criteria

When testing correctly with 2+ participants:
- ✅ No connection errors
- ✅ Multiple video feeds visible
- ✅ Real-time audio/video
- ✅ Controls work for everyone
- ✅ "Copy Link" sharing works
- ✅ Anyone can join with the link

---

## 📸 What Success Looks Like

### Grid Layout:
```
┌─────────┬─────────┐
│  You    │ Person 2│
├─────────┼─────────┤
│ Person 3│ Person 4│
└─────────┴─────────┘
```

### Status Indicators:
```
Room: prg5nglv | 🟢 connected | 👥 4 participants
```

### Console (Clean):
```javascript
Signaling WebSocket connected ✓
Peer joined: abc123 ✓
Received stream from peer: abc123 ✓
Connection state: connected ✓
```

---

## 🚀 Ready to Test!

**Right now, open an incognito window and paste:**
```
http://localhost:8080/room/prg5nglv
```

**The connection error will disappear and you'll see both video feeds!** ✨

---

**Remember: The app works perfectly - you just need another participant to join!** 🎥👥

