# 🚀 Deploy to Vercel - Quick Guide

## 📋 What You Need

- GitHub account (free)
- Vercel account (free) - https://vercel.com
- Railway or Render account (free) for backend

---

## ⚡ Quick Deploy (3 Steps)

### Step 1: Deploy Backend (5 minutes)

**Option A: Railway (Recommended)**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Set **Root Directory** to `server`
6. Click **"Deploy"**
7. Go to **Settings → Networking** → Copy your domain
8. Your backend URL: `wss://your-app.up.railway.app` ✅

**Option B: Render**

1. Go to https://render.com
2. Sign up with GitHub  
3. **New +** → **Web Service**
4. Connect repository
5. Configure:
   - **Root Directory:** `server`
   - **Build:** `npm install`
   - **Start:** `node server.js`
6. Click **Create**
7. Copy your URL
8. Your backend URL: `wss://your-app.onrender.com` ✅

---

### Step 2: Deploy Frontend to Vercel (2 minutes)

**Option A: One-Command Deploy**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
./deploy-vercel.sh
```

The script will ask for your backend URL. Paste the URL from Step 1!

**Option B: Manual Deploy**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repo
5. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `wss://your-backend-url.com` (from Step 1)
7. Click **"Deploy"**

---

### Step 3: Test Your App (1 minute)

1. Open your Vercel URL (shown after deployment)
2. Click **"Create New Room"**
3. Open the same URL in incognito/another device
4. Both should connect! 🎉

---

## 🎯 Complete Example

**After deployment:**
```
✅ Frontend: https://babel-stream-talk.vercel.app
✅ Backend:  wss://babel-stream-talk.up.railway.app
✅ Working:  Multi-participant video calls!
```

**Share with anyone:**
```
https://babel-stream-talk.vercel.app/room/abc123
```

Anyone with the link can join! 🎥

---

## 🐛 Troubleshooting

### "Connection Error" after deployment

**Check:**
1. Backend is deployed and running (visit the HTTP URL in browser)
2. Environment variable `VITE_BACKEND_URL` is set in Vercel
3. Using `wss://` (not `ws://`)

**Fix:**
```bash
# Add environment variable
vercel env add VITE_BACKEND_URL production

# Redeploy
vercel --prod
```

### Backend "Application Error"

**Railway:**
- Check **Deployments** → **Logs**
- Ensure `server/package.json` exists
- Verify build succeeded

**Render:**
- Check service **Logs**
- Free tier sleeps after 15 minutes (wakes up on first request)

### Camera/Mic Not Working

- ✅ Vercel automatically provides HTTPS (required for camera access)
- Users must **grant permissions** in browser
- Check browser console for specific errors

---

## 💡 Pro Tips

### Free Tier Limits

**Vercel:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- Perfect for frontend!

**Railway:**
- ✅ $5 trial credit
- ⚠️ Sleeps when inactive (free tier)
- 💰 ~$5-20/month for production

**Render:**
- ✅ 750 hours/month free
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Slower cold starts

### Keep Backend Awake

**Option 1: Ping Service**
Use https://uptimerobot.com (free) to ping your backend every 5 minutes

**Option 2: Upgrade**
Railway/Render paid plans don't sleep (~$5-7/month)

---

## 📝 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend (Railway or Render)
- [ ] Copy backend WebSocket URL (`wss://...`)
- [ ] Deploy frontend to Vercel
- [ ] Set `VITE_BACKEND_URL` environment variable
- [ ] Test with 2+ devices/browsers
- [ ] Share room links and verify others can join

---

## 🎉 You're Done!

Your video conferencing app is now:
- ✅ Deployed globally
- ✅ Accessible from anywhere
- ✅ Supporting multiple participants
- ✅ Ready to share!

**Just share your Vercel URL and start video calling!** 🚀✨

---

## 📚 Need More Details?

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Detailed instructions
- Advanced configuration
- Security best practices
- TURN server setup
- Custom domains

---

## 🆘 Still Need Help?

1. Check backend logs (Railway/Render dashboard)
2. Check browser console for errors
3. Verify environment variables are set
4. Ensure both services are deployed

**Backend URL format:**
```
✅ wss://your-app.railway.app
✅ wss://your-app.onrender.com
❌ ws://localhost:8000 (local only!)
❌ https://... (should be wss://)
```

---

**Happy deploying! 🎊**

