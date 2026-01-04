# 🚀 START HERE - Career Compass

## Welcome! You're 3 Steps Away from Using Career Compass

---

## Step 1: Get Your OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com
2. Sign up or log in
3. Click your profile → "View API Keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

💡 **Free accounts get $5 credit** - enough for hundreds of analyses!

---

## Step 2: Set Up the Project (3 minutes)

### Option A: Automated Setup (Recommended)
```bash
# Double-click this file:
setup.bat

# Then edit backend\.env and add your API key:
OPENAI_API_KEY=sk-your-key-here
```

### Option B: Manual Setup
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env file and add: OPENAI_API_KEY=sk-your-key-here

# Frontend (new terminal)
cd frontend
npm install
```

---

## Step 3: Run the Application (1 minute)

### Open 2 Terminals:

**Terminal 1 - Backend:**
```bash
# Double-click this file OR run:
start-backend.bat

# Or manually:
cd backend
python main.py
```
✅ Backend will run at http://localhost:8000

**Terminal 2 - Frontend:**
```bash
# Double-click this file OR run:
start-frontend.bat

# Or manually:
cd frontend
npm run dev
```
✅ Frontend will run at http://localhost:3000

---

## 🎉 That's It! Open Your Browser

Navigate to: **http://localhost:3000**

You should see the Career Compass homepage!

---

## ✅ Quick Test

1. Click "Resume Analysis" tab
2. Upload a PDF resume
3. Paste a job description
4. Click "Analyze Match"
5. See your results!

---

## 📚 Need More Help?

### Quick Guides
- **Just starting?** → [QUICKSTART.md](QUICKSTART.md)
- **Want visuals?** → [USER_GUIDE.md](USER_GUIDE.md)
- **Having issues?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Complete Documentation
- **Full guide** → [README.md](README.md)
- **Examples** → [EXAMPLES.md](EXAMPLES.md)
- **All docs** → [INDEX.md](INDEX.md)

---

## ❓ Common Issues

### "Python not found"
- Install Python 3.8+ from https://python.org
- Check "Add Python to PATH" during installation

### "Node not found"
- Install Node.js 16+ from https://nodejs.org

### "OpenAI API error"
- Make sure your API key is in `backend\.env`
- Format: `OPENAI_API_KEY=sk-your-key` (no spaces/quotes)

### "Can't connect to backend"
- Make sure backend is running (Terminal 1)
- Check http://localhost:8000/health shows "healthy"

---

## 🎯 What Can You Do?

### 1. Resume Analysis 📊
- Upload your resume (PDF)
- Paste job description
- Get match score (0-100%)
- See missing skills
- Get ATS optimization tips

### 2. Bullet Point Generator ✍️
- Describe your experience
- Get professional bullet points
- Copy to your resume

### 3. Interview Prep 💼
- Paste job description
- Get role-specific questions
- Prepare your answers

---

## 💡 Pro Tips

- **Use real resumes** - Not lorem ipsum
- **Full job descriptions** - Include requirements
- **Be patient** - First request takes 10-20 seconds
- **Try all features** - Each tab has something useful

---

## 🚀 You're Ready!

**Everything is set up and documented.**

**Just add your API key and start using it!**

Questions? Check [INDEX.md](INDEX.md) for navigation.

---

**Good luck with your job search! 🎯**
