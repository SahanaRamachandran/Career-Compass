# Career Compass - Quick Start Guide

## Setup in 5 Minutes ⚡

### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your API key
echo OPENAI_API_KEY=sk-your-key-here > .env
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```
Backend will run at http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run at http://localhost:3000

### Step 5: Use the App
1. Open http://localhost:3000 in your browser
2. Upload a resume (PDF)
3. Paste a job description
4. Click "Analyze Match"
5. Get instant insights!

## Verify Setup

Test the backend API:
- Open http://localhost:8000/health in browser
- Should see: `{"status": "healthy"}`

## Common Commands

### Backend
```bash
# Start server
python main.py

# Install new package
pip install package-name

# Freeze dependencies
pip freeze > requirements.txt
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Need Help?

- Backend API docs: http://localhost:8000/docs
- Check README.md for detailed documentation
- Ensure Python 3.8+ and Node.js 16+ are installed

---

**Ready to match your resume! 🚀**
