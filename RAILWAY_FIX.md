# 🔧 Railway Deployment - Fixed!

## ✅ What I Fixed

1. ✅ **Removed `bun.lockb`** - Railway will now use npm (like your project is designed for)
2. ✅ **Added `railway.json`** - Proper Railway configuration
3. ✅ **Pushed to GitHub** - Changes are live

---

## 🚀 Fix Your Railway Deployment

### ⚠️ IMPORTANT: Set Root Directory

Railway is trying to deploy the entire project. You need to tell it to deploy only the `server` folder.

**Follow these steps:**

### Step 1: Delete Current Service

1. In Railway, click on **"babel-stream-talk"** service
2. Go to **"Settings"** tab
3. Scroll down and click **"Delete Service"**
4. Confirm deletion

### Step 2: Create New Service

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose **"giresh03/babel-stream-talk"**
4. Railway will create a new service

### Step 3: Configure Root Directory ⭐ CRITICAL

1. Click on the new service
2. Go to **"Settings"** tab
3. Find **"Root Directory"** setting
4. Change from **"/"** to **"server"**
5. Click **"Save"**

### Step 4: Set Environment Variable (if needed)

1. Go to **"Variables"** tab
2. Add variable:
   - **Name:** `PORT`
   - **Value:** Leave empty (Railway auto-provides)
3. Railway automatically provides PORT, so this is optional

### Step 5: Deploy

1. Railway should auto-deploy after saving
2. Wait for build to complete (~1-2 minutes)
3. Go to **"Settings"** → **"Networking"**
4. Click **"Generate Domain"**
5. Copy your domain (e.g., `your-app.up.railway.app`)

---

## ✅ Verify Deployment

After deployment succeeds:

1. **Visit HTTP URL:** `https://your-app.up.railway.app`
   - Should show: "WebRTC Signaling Server"

2. **Your WebSocket URL:** `wss://your-app.up.railway.app`
   - Use this in Vercel frontend!

---

## 🎯 Alternative: Manual Configuration

If you didn't delete the service, fix it:

1. Click on **"babel-stream-talk"** service
2. **Settings** tab
3. **Root Directory:** Change to `server`
4. **Start Command:** `node server.js` (should auto-detect)
5. **Build Command:** `npm install` (should auto-detect)
6. Click **"Redeploy"** button

---

## 🐛 Common Issues

### "Build failed" - npm errors
**Fix:** Make sure Root Directory is set to `server`

### "Module not found"
**Fix:** 
- Check Root Directory is `server`
- Check `server/package.json` exists

### "Port already in use"
**Fix:** Don't set PORT variable, Railway provides it automatically

### "Application failed to start"
**Fix:** Check logs tab for specific error

---

## 📋 Correct Railway Settings

```
Service: babel-stream-talk
Root Directory: server          ⭐ MUST BE SET
Build Command: npm install      (auto-detected)
Start Command: node server.js   (auto-detected)
Region: Any
```

---

## 🎉 After Successful Deployment

You'll get a domain like:
```
https://babel-stream-talk-production.up.railway.app
```

**Your WebSocket URL for Vercel:**
```
wss://babel-stream-talk-production.up.railway.app
```

---

## 🚀 Deploy Frontend Next

After backend is deployed:

```bash
./deploy-vercel.sh
```

When asked for backend URL, paste:
```
wss://your-app.up.railway.app
```

---

## 📸 What Success Looks Like

**Railway Dashboard:**
```
✅ babel-stream-talk
   Status: Running
   Latest Deploy: Successful (1 minute ago)
   Domain: your-app.up.railway.app
```

**Visit URL:**
```
https://your-app.up.railway.app
→ Shows: "WebRTC Signaling Server"
```

---

## 🆘 Still Having Issues?

### Check Build Logs
1. Click on deployment
2. Click **"View logs"**
3. Look for specific errors

### Common Log Errors

**"Cannot find module"**
- Root Directory not set to `server`

**"npm: command not found"**
- Railway is using wrong package manager
- Should be fixed now (removed bun.lockb)

**"EADDRINUSE"**
- PORT conflict
- Remove PORT environment variable if you set one

---

## 🎯 Quick Checklist

- [ ] Deleted old service (or updated Root Directory)
- [ ] Created new service from GitHub repo
- [ ] Set Root Directory to `server` ⭐
- [ ] Deployment succeeded
- [ ] Generated domain
- [ ] Visited HTTP URL - shows "WebRTC Signaling Server"
- [ ] Copied WebSocket URL (`wss://...`)

---

## ✨ Next Steps

After Railway deployment succeeds:

1. **Copy your Railway URL:** `wss://your-app.up.railway.app`
2. **Deploy frontend:** `./deploy-vercel.sh`
3. **Paste Railway URL** when asked
4. **Your app goes LIVE!** 🎉

---

**The fix is pushed to GitHub. Now reconfigure Railway with Root Directory = "server"!** 🚀

