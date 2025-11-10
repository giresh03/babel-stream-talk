# ⚡ Quick Reference Card

## 🚀 Currently Running!

✅ Backend: `http://localhost:8000`  
✅ Frontend: `http://localhost:8080`  

**→ Open in browser:** `http://localhost:8080`

---

## 📌 Common Commands

| Action | Command |
|--------|---------|
| **Start everything** | `./start.sh` |
| **Check status** | `./check-status.sh` |
| **Stop services** | Press `Ctrl+C` in terminal |
| **Kill all** | `pkill -f "node"` |
| **Check ports** | `lsof -i :8000` or `lsof -i :8080` |
| **Test backend** | `curl http://localhost:8000` |

---

## 🎥 Using the App

1. **Go to:** `http://localhost:8080`
2. **Click:** "Create New Room"
3. **Click:** "Copy Link" button
4. **Share:** Send link to others
5. **Everyone joins!** 🎉

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Port in use | `./start.sh` (auto-kills old processes) |
| Can't connect | Refresh browser (Cmd+Shift+R) |
| No video | Grant camera/mic permissions |
| Connection error | Check if backend is running |

---

## 📂 Important Files

- `ALL_FIXED.md` - Complete solution details
- `START_HERE.md` - First-time setup
- `QUICK_START.md` - 3-minute guide
- `SETUP.md` - Detailed instructions

---

## ✅ Verification

```bash
./check-status.sh
```

Should show:
- ✅ Backend running on port 8000
- ✅ Frontend running on port 8080

---

**Your app is ready! Just open `http://localhost:8080` 🚀**

