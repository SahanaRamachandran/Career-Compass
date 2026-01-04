# Career Compass Project Structure

```
career-compass/
│
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # FastAPI app with all endpoints
│   ├── models.py              # Pydantic data models
│   ├── pdf_parser.py          # PDF text extraction (PyMuPDF)
│   ├── embedding_service.py   # OpenAI embeddings + cosine similarity
│   ├── vector_store.py        # FAISS vector database
│   ├── ai_analyzer.py         # GPT analysis for insights
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example          # Template for .env
│   └── .gitignore
│
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx           # Main app with tabs
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Tailwind CSS
│   │   ├── api.js            # Axios API client
│   │   ├── UploadSection.jsx     # Resume upload + job input
│   │   ├── ResultsSection.jsx    # Match score + analysis display
│   │   ├── BulletPointGenerator.jsx  # Resume bullet points tool
│   │   └── InterviewPrep.jsx     # Interview questions generator
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── README.md                  # Full documentation
├── QUICKSTART.md             # 5-minute setup guide
└── .env.example              # Root environment template
```

## Component Responsibilities

### Backend Services

1. **main.py** - API endpoints and request handling
2. **pdf_parser.py** - Extract and clean text from PDF files
3. **embedding_service.py** - Generate embeddings, calculate similarity
4. **vector_store.py** - Manage FAISS index for vector search
5. **ai_analyzer.py** - GPT-powered analysis and content generation

### Frontend Components

1. **App.jsx** - Main layout, tab navigation, state management
2. **UploadSection.jsx** - File upload and form inputs
3. **ResultsSection.jsx** - Display match scores and insights
4. **BulletPointGenerator.jsx** - Generate resume bullet points
5. **InterviewPrep.jsx** - Generate interview questions
6. **api.js** - HTTP client for backend communication

## Data Flow

```
User uploads PDF + Job Description
         ↓
    UploadSection
         ↓
    API Call (api.js)
         ↓
FastAPI Backend (main.py)
         ↓
PDF Parser extracts text
         ↓
Embedding Service generates vectors
         ↓
Calculate cosine similarity
         ↓
AI Analyzer provides insights
         ↓
JSON Response
         ↓
ResultsSection displays results
```

## Key Features Mapping

| Feature | Backend | Frontend |
|---------|---------|----------|
| Resume Upload | `POST /api/analyze` | UploadSection.jsx |
| Match Score | embedding_service.py | ResultsSection.jsx |
| Skills Analysis | ai_analyzer.py | ResultsSection.jsx |
| Bullet Points | `POST /api/bullet-points` | BulletPointGenerator.jsx |
| Interview Prep | `POST /api/interview-questions` | InterviewPrep.jsx |
