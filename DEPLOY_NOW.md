# 🚀 DEPLOY NOW - 2 Simple Steps!

## ⚡ Your app is 100% ready to deploy!

---

## 📍 Step 1: Deploy Backend (5 minutes)

### Go to: https://railway.app

```
1. Click "Sign up with GitHub"
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your repository
5. ⚠️  IMPORTANT: Set "Root Directory" to: server
6. Click "Deploy"
7. Wait for deployment...
8. Go to "Settings" → "Networking"
9. Copy your domain (something like: your-app.up.railway.app)
```

### ✅ Your backend URL:
```
wss://your-app.up.railway.app
```

**Copy this URL! You'll need it in Step 2!**

---

## 📍 Step 2: Deploy Frontend (2 minutes)

### Open Terminal and Run:

```bash
./deploy-vercel.sh
```

### The script will ask you:

```
1. "Install Vercel CLI?" → It installs automatically
2. "Login to Vercel?" → Opens browser to login
3. "Enter backend URL?" → Paste: wss://your-app.up.railway.app
```

### That's it! ✨

---

## 🎉 Your App is Now LIVE!

After deployment, you'll see something like:

```
✅ Deployed to: https://babel-stream-talk.vercel.app
```

---

## 🧪 Test Your Live App

### 1. Open your Vercel URL in browser
```
https://your-app.vercel.app
```

### 2. Create a room
```
Click "Create New Room"
```

### 3. Share the link
```
Click "Copy Link"
Open on your phone or send to a friend
```

### 4. Join and connect!
```
Both devices should see each other's video
No "Connection Error" message
Participant counter shows "2 participants"
```

---

## ✅ Success Looks Like:

```
┌─────────────────────────────────────────┐
│  Room: abc123    🟢 connected    👥 2   │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐              │
│  │   You   │  │ Person 2│              │
│  │  [video]│  │ [video] │              │
│  └─────────┘  └─────────┘              │
│                                         │
│     🎤      📹      📞                  │
└─────────────────────────────────────────┘
```

---

## 🐛 If Something Goes Wrong

### Connection Error after deployment:

```bash
# Make sure you entered backend URL correctly
# It should be: wss://your-app.railway.app (not http or ws)

# Fix it:
vercel env add VITE_BACKEND_URL production
# Paste your backend URL
vercel --prod
```

### Backend not working:

1. Go to Railway dashboard
2. Click on your service
3. Check "Deployments" → "Logs"
4. Look for errors

### Still stuck?

Read: [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed troubleshooting

---

## 💰 Cost

### Free to start!
- Vercel: FREE (forever for most use cases)
- Railway: $5 trial credit (perfect for testing)

### After trial:
- ~$5-20/month for production use

---

## 📚 More Info

| Need | Read This |
|------|-----------|
| Quick guide | [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) |
| Detailed guide | [DEPLOYMENT.md](DEPLOYMENT.md) |
| All deployment files | [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) |
| Troubleshooting | [DEPLOYMENT.md](DEPLOYMENT.md) |

---

## 🎯 Commands Reference

```bash
# Deploy (automated)
./deploy-vercel.sh

# Deploy (manual)
vercel --prod

# Check status
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add VITE_BACKEND_URL production
```

---

## ⏱️ Time Estimate

- Backend deployment: ~5 minutes
- Frontend deployment: ~2 minutes
- Testing: ~1 minute
- **Total: ~8 minutes** ⚡

---

## 🎊 Ready? Let's Go!

### Right now, run:

```bash
./deploy-vercel.sh
```

### Your video call app will be live in 8 minutes! 🚀✨

---

**Questions? Check [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed help!**

