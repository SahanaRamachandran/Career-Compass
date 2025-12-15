# Career Compass - Troubleshooting Guide

## Common Issues & Solutions

### Setup Issues

#### ❌ "Python is not recognized"
**Problem**: Python not installed or not in PATH

**Solution**:
1. Download Python 3.8+ from https://python.org
2. During installation, check "Add Python to PATH"
3. Restart terminal and try again

#### ❌ "Node is not recognized"  
**Problem**: Node.js not installed or not in PATH

**Solution**:
1. Download Node.js 16+ from https://nodejs.org
2. Install with default settings
3. Restart terminal and try again

#### ❌ "pip: command not found"
**Problem**: pip not installed with Python

**Solution**:
```bash
python -m ensurepip --upgrade
python -m pip install --upgrade pip
```

### Backend Issues

#### ❌ "OPENAI_API_KEY not found in environment variables"
**Problem**: .env file missing or API key not set

**Solution**:
1. Make sure `backend\.env` file exists
2. Copy from `.env.example` if needed:
   ```bash
   cd backend
   copy .env.example .env
   ```
3. Edit `.env` and add your key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

#### ❌ "ModuleNotFoundError: No module named 'fastapi'"
**Problem**: Dependencies not installed or venv not activated

**Solution**:
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

#### ❌ "Failed to extract text from PDF"
**Problem**: PDF is encrypted, scanned, or image-based

**Solution**:
- Make sure PDF has selectable text (not scanned image)
- Try saving PDF as "Print to PDF" from another viewer
- Use PDFs created by Word, Google Docs, or LaTeX

#### ❌ "OpenAI API rate limit exceeded"
**Problem**: Too many requests or quota exceeded

**Solution**:
- Wait a few seconds and try again
- Check your OpenAI account usage/billing
- Upgrade to paid plan if needed

#### ❌ Port 8000 already in use
**Problem**: Another application using port 8000

**Solution**:
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <pid_number> /F

# Or change port in main.py:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Frontend Issues

#### ❌ "npm install" fails
**Problem**: Network issues or corrupted packages

**Solution**:
```bash
cd frontend
# Clear npm cache
npm cache clean --force
# Remove node_modules
rmdir /s /q node_modules
# Reinstall
npm install
```

#### ❌ Port 3000 already in use
**Problem**: Another app running on port 3000

**Solution**:
- Close other dev servers
- Or edit `frontend\vite.config.js`:
  ```javascript
  server: {
    port: 3001,
  }
  ```

#### ❌ "Failed to connect to backend"
**Problem**: Backend not running or CORS issue

**Solution**:
1. Make sure backend is running on port 8000
2. Check backend terminal for errors
3. Verify `http://localhost:8000/health` works in browser

#### ❌ Blank page or white screen
**Problem**: JavaScript error in frontend

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+F5)
   - Check if all files in src/ exist

### Runtime Issues

#### ❌ "Analysis takes too long"
**Problem**: Large PDF or OpenAI API slow

**Expected Time**:
- Small resume (1-2 pages): 5-10 seconds
- Large resume (3+ pages): 10-20 seconds

**Solution**:
- Wait patiently (first request may be slower)
- Check internet connection
- Ensure PDF is not too large (< 5 MB recommended)

#### ❌ "Match score seems wrong"
**Problem**: Resume or job description too short

**Solution**:
- Resume should be at least 100 characters of meaningful text
- Job description should be at least 50 characters
- Make sure both contain relevant content

#### ❌ Weak or generic AI suggestions
**Problem**: Input text lacks detail

**Solution**:
- Provide complete job descriptions (not just titles)
- Include full resume content
- More detail = better analysis

### File Upload Issues

#### ❌ "Only PDF files are supported"
**Problem**: Trying to upload DOCX, TXT, or other formats

**Solution**:
- Convert to PDF first:
  - Word: File → Save As → PDF
  - Google Docs: File → Download → PDF
  - Online converters: word2pdf.com

#### ❌ "Could not extract sufficient text from PDF"
**Problem**: Scanned PDF or very short resume

**Solution**:
- Use a PDF with selectable text
- Ensure resume is at least 1 page with real content
- Try recreating PDF from source document

### API Key Issues

#### ❌ "Invalid API key"
**Problem**: Wrong key or formatting issue

**Solution**:
1. Get key from https://platform.openai.com/api-keys
2. Copy entire key (starts with `sk-`)
3. No spaces or quotes in .env file:
   ```
   OPENAI_API_KEY=sk-abc123...
   ```

#### ❌ "Insufficient credits"
**Problem**: OpenAI account has no credits

**Solution**:
1. Add payment method at https://platform.openai.com/account/billing
2. Add credits ($5 minimum recommended)
3. Free trial includes $5 credit for new accounts

### Development Issues

#### ❌ Changes not showing in browser
**Problem**: Browser cache or dev server issue

**Solution**:
1. Hard refresh: Ctrl+F5
2. Clear browser cache
3. Restart dev server
4. Check file was actually saved

#### ❌ "Cannot find module" after editing
**Problem**: Import path incorrect

**Solution**:
- Use relative imports: `./Component.jsx`
- Check file names match (case-sensitive)
- Restart dev server

### Windows-Specific Issues

#### ❌ "venv\Scripts\activate.bat not recognized"
**Problem**: Running in wrong shell or path issue

**Solution**:
```bash
# Use full path
cd backend
.\venv\Scripts\activate

# Or use PowerShell:
.\venv\Scripts\Activate.ps1
```

#### ❌ PowerShell execution policy error
**Problem**: Scripts disabled in PowerShell

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Still Having Issues?

### Diagnostic Checklist

✅ Python 3.8+ installed and in PATH  
✅ Node.js 16+ installed and in PATH  
✅ OpenAI API key in backend\.env  
✅ Backend dependencies installed  
✅ Frontend dependencies installed  
✅ Both servers running without errors  
✅ No firewall blocking localhost  

### Get More Help

1. **Check backend logs**: Look at terminal running `python main.py`
2. **Check frontend logs**: Look at terminal running `npm run dev`
3. **Check browser console**: F12 → Console tab
4. **Test API directly**: Visit http://localhost:8000/docs

### Clean Reinstall

If all else fails:

```bash
# Backend
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend  
cd frontend
rmdir /s /q node_modules
npm install
```

### Verify Installation

```bash
# Backend
cd backend
python --version     # Should be 3.8+
pip list            # Should show all packages

# Frontend
cd frontend
npm --version       # Should be 8+
npm list --depth=0  # Should show all packages
```

## Quick Tests

### Test Backend
```bash
# Start backend
cd backend
python main.py

# In browser, visit:
http://localhost:8000/health
# Should see: {"status": "healthy"}

http://localhost:8000/docs
# Should see: FastAPI interactive docs
```

### Test Frontend
```bash
# Start frontend
cd frontend
npm run dev

# In browser, visit:
http://localhost:3000
# Should see: Career Compass homepage
```

## Performance Tips

1. **First run is slower** - OpenAI API warms up
2. **Use smaller PDFs** - Faster processing
3. **Shorter job descriptions** - Faster analysis but less accurate
4. **Close unused tabs** - Free up memory

## Security Notes

- Never commit .env files
- Don't share your OpenAI API key
- Use environment variables for secrets
- Keep dependencies updated

---

**Still stuck?** Double-check all steps in QUICKSTART.md
