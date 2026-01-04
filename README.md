# Career Compass

AI resume analyzer that helps match your resume with job descriptions.

## Setup

Install Python and Node.js first.

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in backend folder:
```
OPENAI_API_KEY=your_key_here
```

**Frontend:**
```bash
cd frontend
npm install
```

## Run

Start both servers:

**Backend:**
```bash
cd backend
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Features

- Resume analysis with job description matching
- ATS optimization tips
- Interview question generator
- Resume builder
- Career switch advisor
- Skills gap analysis
- Mock interviews with AI feedback

Built with FastAPI, React, OpenAI GPT-4
