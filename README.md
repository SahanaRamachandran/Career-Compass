# Career Compass 🧭

Hey there! Welcome to Career Compass - your personal career assistant that makes job hunting less stressful. Whether you're a student applying for your first job or a professional switching careers, this tool has your back.

## What Can It Do? ✨

- **Smart Resume Analysis**: Just upload your resume and paste a job description. Within seconds, you'll know how well they match (we give you a score out of 100)
- **Find What's Missing**: We'll tell you exactly which skills the job wants that you haven't mentioned yet
- **Beat the Bots**: Get practical tips to make your resume ATS-friendly (those are the automated systems that screen resumes)
- **Write Better Bullets**: Struggling to describe your experience? We'll generate professional bullet points you can actually use
- **Ace Your Interview**: Get common interview questions for the role you're targeting
- **Track Your Progress**: Upload multiple versions of your resume and see how you're improving over time
- **Visual Insights**: Charts and graphs that actually make sense - see your strengths, gaps, and improvements at a glance

## What's Under the Hood? 🛠️

I built this with some pretty cool tech:

**Backend (The Brain)**
- FastAPI for handling requests super fast
- OpenAI's GPT models for the smart analysis part
- FAISS for comparing resumes and job descriptions efficiently
- Python because it just works

**Frontend (What You See)**
- React to keep things snappy
- Tailwind CSS for a clean, modern look
- Vite because nobody likes waiting for builds

## Before You Start 📋

You'll need:
- Python 3.8+ (check with `python --version`)
- Node.js 16+ (check with `node --version`)
- An OpenAI API key ([grab one here](https://platform.openai.com) - don't worry, they give you free credits to start)

## Getting Started 🚀

### Quick Setup (5 minutes, I promise!)

**Step 1: Get the code**
```bash
git clone https://github.com/SahanaRamachandran/Career-Compass.git
cd Career-Compass
```

**Step 2: Set up the backend**
```bash
cd backend

# Create a virtual environment (keeps things clean)
python -m venv venv

# Turn it on
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install what we need
pip install -r requirements.txt

# Add your OpenAI key
copy .env.example .env
# Now open .env and add: OPENAI_API_KEY=your-key-here
```

**Step 3: Set up the frontend**
```bash
cd ../frontend
npm install
```

### Running Everything 🏃

**Fire up the backend:**
```bash
cd backend
python main.py
```
You'll see it running at http://localhost:8000

**Fire up the frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```
Open your browser to http://localhost:3000 and you're good to go!

## How to Use It 📖

### Analyzing Your Resume

1. Click on **Resume Analysis**
2. Upload your resume (PDF only - we all have one lying around)
3. Copy-paste that job description you're eyeing
4. Hit **Analyze Resume**
5. Boom! You'll see:
   - How good the match is (percentage score)
   - What you're already great at
   - Skills you should probably add
   - Tips to get past those resume robots (ATS systems)
   - A breakdown of each section of your resume

### Making Your Bullet Points Shine

1. Jump to **Bullet Points**
2. Write about what you actually did in a role (be honest!)
3. Tell us the job title you're targeting
4. Click **Generate Bullet Points**
5. Get 8-10 ready-to-use bullet points. Pick your favorites!

### Preparing for Interviews

1. Head to **Interview Prep**
2. Paste that job description again
3. Get a list of questions they'll probably ask
4. Practice your answers (seriously, practice out loud - it helps!)

## API Endpoints 🔌

### `POST /api/analyze`
Analyze resume against job description
- **Body**: `multipart/form-data`
  - `resume`: PDF file
  - `job_description`: string
- **Returns**: Match score, skills analysis, suggestions

### `POST /api/bullet-points`
Generate resume bullet points
- **Body**: `application/json`
  ```json
  {
    "experience": "string",
    "job_title": "string"
  }
  ```
- **Returns**: List of bullet points

### `POST /api/interview-questions`
Generate interview questions
- **Body**: `application/json`
  ```json
  {
    "text": "job description"
  }
  ```
- **Returns**: List of interview questions

## Project Structure 📁

```
project/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py              # Pydantic models
│   ├── pdf_parser.py          # PDF text extraction
│   ├── embedding_service.py   # OpenAI embeddings
│   ├── vector_store.py        # FAISS vector storage
│   ├── ai_analyzer.py         # AI analysis and insights
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main application component
    │   ├── main.jsx           # Entry point
    │   ├── index.css          # Global styles
    │   ├── api.js             # API client
    │   ├── UploadSection.jsx  # Resume upload component
    │   ├── ResultsSection.jsx # Analysis results display
    │   ├── BulletPointGenerator.jsx
    │   └── InterviewPrep.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Configuration ⚙️

### OpenAI API Key

1. Sign up at https://platform.openai.com
2. Create an API key
3. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### Cost Estimation (Free Tier Friendly)

- **text-embedding-3-small**: ~$0.00002 per 1K tokens
- **gpt-3.5-turbo**: ~$0.0005 per 1K tokens

Typical analysis costs less than $0.01 per resume!

## Troubleshooting 🔧

### Backend Issues

**Problem**: `OPENAI_API_KEY not found`
- **Solution**: Make sure you created `.env` file in backend directory with your API key

**Problem**: `ModuleNotFoundError`
- **Solution**: Activate virtual environment and run `pip install -r requirements.txt`

**Problem**: PDF extraction fails
- **Solution**: Ensure the PDF is not encrypted and contains selectable text

### Frontend Issues

**Problem**: `Cannot connect to backend`
- **Solution**: Make sure backend is running on port 8000

**Problem**: CORS errors
- **Solution**: Backend already has CORS configured for localhost:3000

## Future Enhancements 🚀

- [ ] Support for DOCX and TXT resume formats
- [ ] Resume scoring history tracking
- [ ] Multiple resume comparison
- [ ] Job recommendation system
- [ ] LinkedIn profile integration
- [ ] Export analysis as PDF report
- [ ] User authentication and profiles
- [ ] Database integration for history

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

MIT License - feel free to use this project for learning and personal use.

## Support 💬

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for students and job seekers**

Happy job hunting! 🎯
