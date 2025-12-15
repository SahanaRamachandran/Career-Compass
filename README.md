# Career Compass 🧭

A smart resume-to-job matching platform that helps students and professionals analyze their resumes, get ATS optimization tips, and prepare for interviews using AI.

## Features ✨

- **Resume Analysis**: Upload your resume (PDF) and job description to get a detailed match score (0-100%)
- **Semantic Matching**: Uses OpenAI embeddings and FAISS for accurate similarity calculation
- **Missing Skills Detection**: Identifies skills you need to add
- **ATS Optimization**: Get actionable suggestions to improve your resume for Applicant Tracking Systems
- **Bullet Point Generator**: Generate professional resume bullet points based on your experience
- **Interview Preparation**: Get role-specific interview questions to prepare
- **Clean UI**: Simple, minimal, and professional dashboard built with React and Tailwind CSS

## Tech Stack 🛠️

### Backend
- **FastAPI**: Modern Python web framework
- **PyMuPDF (fitz)**: PDF text extraction
- **OpenAI API**: Text embeddings and GPT-3.5 for analysis
- **FAISS**: Vector similarity search
- **NumPy**: Mathematical operations

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client

## Prerequisites 📋

- Python 3.8 or higher
- Node.js 16 or higher
- OpenAI API key (get one at https://platform.openai.com)

## Installation 🚀

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-key-here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application 🏃

### Start Backend Server

```bash
# In backend directory with virtual environment activated
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

### Start Frontend Development Server

```bash
# In frontend directory
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage Guide 📖

### 1. Resume Analysis

1. Navigate to the **Resume Analysis** tab
2. Click to upload your resume (PDF format)
3. Paste the job description in the text area
4. Click **Analyze Match**
5. View your results:
   - Overall match score (0-100%)
   - Your strengths
   - Missing skills
   - Areas to improve
   - ATS optimization suggestions

### 2. Bullet Point Generator

1. Navigate to the **Bullet Points** tab
2. Describe your work experience
3. Enter the target job title
4. Click **Generate Bullet Points**
5. Copy the professional bullet points to your resume

### 3. Interview Preparation

1. Navigate to the **Interview Prep** tab
2. Paste the job description
3. Click **Generate Interview Questions**
4. Review and prepare answers for the role-specific questions

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
