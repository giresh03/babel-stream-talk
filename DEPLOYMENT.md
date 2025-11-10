# 🚀 Deployment Guide

This guide covers deploying your video conferencing app to production.

## 📋 Overview

Your app has **two components** that need to be deployed separately:

1. **Frontend** (React + Vite) → Deploy to **Vercel** ✅
2. **Backend** (WebSocket Server) → Deploy to **Railway** or **Render** ✅

---

## 🎯 Part 1: Deploy Frontend to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
cd /Users/gireshkumar/Downloads/babel-stream-talk-main
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → babel-stream-talk (or your choice)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

#### Step 4: Set Environment Variable
After initial deployment:
```bash
vercel env add VITE_BACKEND_URL
```
Enter the value: `wss://your-backend-url.com` (we'll get this in Part 2)

Then redeploy:
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub/GitLab/Bitbucket
3. **Click:** "Add New" → "Project"
4. **Import** your Git repository
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. **Add Environment Variable:**
   - **Key:** `VITE_BACKEND_URL`
   - **Value:** `wss://your-backend-url.com` (add after backend deployment)
7. **Click:** "Deploy"

---

## 🎯 Part 2: Deploy Backend to Railway

### Why Railway?
- ✅ Free tier available
- ✅ WebSocket support
- ✅ Easy deployment
- ✅ Automatic HTTPS/WSS

### Step-by-Step:

#### Step 1: Prepare Backend for Deployment

Create a `Procfile` in the server directory:
```bash
cd server
echo "web: node server.js" > Procfile
```

#### Step 2: Sign up for Railway
1. Go to: https://railway.app
2. Sign up with GitHub
3. Verify your account

#### Step 3: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. If not connected, connect your GitHub account
4. Select your repository
5. Railway will auto-detect it's a Node.js app

#### Step 4: Configure
1. **Root Directory:** Set to `server`
2. **Start Command:** `node server.js`
3. **Port:** Railway will auto-assign (server.js already handles this)

#### Step 5: Add Environment Variable (if needed)
- Click on your service
- Go to **"Variables"** tab
- Add `PORT` (Railway auto-provides this, so usually not needed)

#### Step 6: Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Click on **"Settings"** → **"Networking"**
4. Copy your **public domain** (e.g., `your-app.up.railway.app`)

#### Step 7: Get WebSocket URL
Your WebSocket URL will be:
```
wss://your-app.up.railway.app
```

---

## 🎯 Part 2 (Alternative): Deploy Backend to Render

### Step-by-Step:

#### Step 1: Sign up for Render
1. Go to: https://render.com
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** babel-stream-backend
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

#### Step 3: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment
3. Copy your service URL (e.g., `https://babel-stream-backend.onrender.com`)

#### Step 4: Get WebSocket URL
Your WebSocket URL will be:
```
wss://babel-stream-backend.onrender.com
```

---

## 🔗 Part 3: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

On Vercel:
1. Go to your project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add or update:
   - **Key:** `VITE_BACKEND_URL`
   - **Value:** `wss://your-backend.railway.app` or `wss://your-backend.onrender.com`
4. Click **"Save"**

### Step 2: Redeploy Frontend
```bash
vercel --prod
```

Or in Vercel dashboard:
1. Go to **"Deployments"**
2. Click on latest deployment
3. Click **"Redeploy"**

---

## ✅ Verification

### Test Your Deployed App:

1. **Open your Vercel URL** (e.g., `https://babel-stream-talk.vercel.app`)
2. **Create a room**
3. **Copy the link**
4. **Open in incognito/another device**
5. **Both should connect!** ✨

### Check Logs:

**Backend (Railway):**
1. Go to project
2. Click on service
3. View **"Deployments"** → **"Logs"**

**Backend (Render):**
1. Go to service dashboard
2. Click **"Logs"**

Look for:
```
WebRTC Signaling Server
Running on http://[::]:PORT
```

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Check:**
1. Backend is deployed and running
2. Environment variable `VITE_BACKEND_URL` is correct
3. Using `wss://` (not `ws://`) for production
4. Backend URL doesn't have trailing slash

**Fix:**
```bash
# Update env variable in Vercel
vercel env add VITE_BACKEND_URL production

# Enter: wss://your-backend-url.com (no trailing slash)

# Redeploy
vercel --prod
```

### WebSocket Connection Fails

**Check backend logs for:**
- Server is running
- No startup errors
- WebSocket endpoints are active

**Common issues:**
- Backend service went to sleep (free tier) - first connection wakes it up
- CORS issues - our backend allows all origins by default
- Firewall blocking WebSocket connections

### Video/Audio Not Working

**Remember:**
- Browsers require **HTTPS** for camera/mic access in production
- Vercel provides HTTPS automatically ✅
- Railway/Render provide HTTPS automatically ✅
- Users must grant permissions

---

## 🔒 Security Considerations

### For Production:

1. **Add Authentication:**
   - Implement user login
   - Add room passwords
   - Rate limiting

2. **Secure Backend:**
   ```javascript
   // In server.js, add CORS restrictions:
   const allowedOrigins = ['https://your-app.vercel.app'];
   // Check origin in WebSocket upgrade handler
   ```

3. **Add TURN Servers:**
   - For better NAT traversal
   - Services: Twilio, Xirsys, or self-hosted
   - Update `src/utils/webrtc.ts` with TURN credentials

4. **Environment Variables:**
   - Never commit `.env` files
   - Use Vercel secrets for sensitive data
   - Use Railway/Render environment variables

---

## 💰 Cost Estimates

### Free Tier Limits:

**Vercel (Free):**
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Perfect for frontend

**Railway (Free - Trial):**
- ✅ $5 credit/month
- ✅ Enough for backend testing
- ✅ Sleeps after inactivity
- 💡 Upgrade for production: ~$5-20/month

**Render (Free):**
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity
- ✅ Slower spin-up time
- 💡 Upgrade for production: $7+/month

---

## 🚀 Quick Deploy Commands

```bash
# Deploy Frontend to Vercel
vercel --prod

# Check Frontend Status
vercel ls

# View Frontend Logs
vercel logs

# Update Environment Variable
vercel env add VITE_BACKEND_URL production
```

---

## 📝 Deployment Checklist

### Before Deployment:
- [ ] Test locally with multiple participants
- [ ] Ensure both backend and frontend work
- [ ] Commit all changes to Git
- [ ] Push to GitHub/GitLab

### Deploy Backend:
- [ ] Choose platform (Railway or Render)
- [ ] Deploy backend
- [ ] Get WebSocket URL (`wss://...`)
- [ ] Test backend is accessible

### Deploy Frontend:
- [ ] Set `VITE_BACKEND_URL` environment variable
- [ ] Deploy to Vercel
- [ ] Test connection

### Verify:
- [ ] Open deployed app
- [ ] Create room
- [ ] Share link with another device/browser
- [ ] Both participants connect successfully
- [ ] Audio/video works
- [ ] Controls work

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Frontend: `https://your-app.vercel.app`
- ✅ Backend: `wss://your-backend.railway.app` or `wss://your-backend.onrender.com`
- ✅ Multi-participant video calls working globally
- ✅ Share room links with anyone, anywhere!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

---

**Need help? Check the logs and refer to the troubleshooting section above!** 🚀

