from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path

from models import (
    JobDescriptionInput,
    AnalysisResponse,
    RoleSuitability,
    SectionAnalysis,
    BulletPointRequest,
    BulletPointResponse,
    InterviewQuestionsResponse,
    LearningRoadmapRequest,
    MockInterviewRequest
)
from pdf_parser import PDFParser
from embedding_service import EmbeddingService
from vector_store import VectorStore
from ai_analyzer import AIAnalyzer


app = FastAPI(title="Career Compass API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_parser = PDFParser()
embedding_service = EmbeddingService()
vector_store = VectorStore()
ai_analyzer = AIAnalyzer()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Career Compass API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Analyze resume against job description.
    
    Args:
        resume: PDF file upload
        job_description: Job description text
        
    Returns:
        Detailed analysis with match score and recommendations
    """
    temp_file_path = None
    
    try:
        # Validate file type
        if not resume.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        if not job_description or len(job_description.strip()) < 50:
            raise HTTPException(status_code=400, detail="Job description is too short")
        
        # Save uploaded file temporarily
        temp_file_path = UPLOAD_DIR / f"temp_{resume.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        
        # Extract text from PDF
        resume_text = pdf_parser.extract_text(str(temp_file_path))
        
        if not resume_text or len(resume_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from PDF")
        
        # Generate embeddings
        resume_embedding = embedding_service.generate_embedding(resume_text)
        job_embedding = embedding_service.generate_embedding(job_description)
        
        # Calculate similarity
        similarity_score = embedding_service.calculate_cosine_similarity(
            resume_embedding,
            job_embedding
        )
        
        # Get AI analysis
        analysis = ai_analyzer.analyze_match(resume_text, job_description, similarity_score)
        
        # Prepare comprehensive response
        role_suit = analysis.get("role_suitability", {"level": "Mid-Level", "confidence": "Medium", "reasoning": "Based on experience"})
        sections = analysis.get("resume_sections_analysis", {})
        
        response = AnalysisResponse(
            match_score=round(similarity_score, 3),
            match_percentage=analysis.get("match_percentage", int(similarity_score * 100)),
            match_explanation=analysis.get("match_explanation", f"Resume shows {int(similarity_score * 100)}% match with job requirements."),
            missing_skills=analysis.get("missing_skills", []),
            weak_areas=analysis.get("weak_areas", []),
            strengths=analysis.get("strengths", []),
            ats_suggestions=analysis.get("ats_suggestions", []),
            keywords_found=analysis.get("keywords_found", []),
            keywords_missing=analysis.get("keywords_missing", []),
            keyword_density_score=analysis.get("keyword_density_score", int(similarity_score * 100)),
            role_suitability=RoleSuitability(**role_suit),
            resume_sections_analysis={k: SectionAnalysis(**v) for k, v in sections.items()} if sections else {},
            bullet_point_analysis=analysis.get("bullet_point_analysis", []),
            consistency_issues=analysis.get("consistency_issues", []),
            career_gaps=analysis.get("career_gaps", []),
            summary=analysis.get("summary", "Analysis completed successfully."),
            resume_text=resume_text[:1000],
            job_description=job_description[:1000]
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in analyze_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        # Clean up temporary file
        if temp_file_path and temp_file_path.exists():
            try:
                os.remove(temp_file_path)
            except:
                pass


@app.post("/api/bullet-points", response_model=BulletPointResponse)
async def generate_bullet_points(request: BulletPointRequest):
    """
    Generate improved resume bullet points.
    
    Args:
        request: Experience and job title
        
    Returns:
        List of generated bullet points
    """
    try:
        if not request.experience or len(request.experience.strip()) < 20:
            raise HTTPException(status_code=400, detail="Experience description is too short")
        
        if not request.job_title:
            raise HTTPException(status_code=400, detail="Job title is required")
        
        bullet_points = ai_analyzer.generate_bullet_points(
            request.experience,
            request.job_title
        )
        
        return BulletPointResponse(bullet_points=bullet_points)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate_bullet_points: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/api/interview-questions", response_model=InterviewQuestionsResponse)
async def get_interview_questions(job_input: JobDescriptionInput):
    """
    Generate interview preparation questions.
    
    Args:
        job_input: Job description
        
    Returns:
        List of interview questions
    """
    try:
        if not job_input.text or len(job_input.text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Job description is too short")
        
        questions = ai_analyzer.generate_interview_questions(job_input.text)
        
        return InterviewQuestionsResponse(questions=questions)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_interview_questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/api/learning-roadmap")
async def generate_learning_roadmap(request: LearningRoadmapRequest):
    """
    Generate personalized 30-60-90 day learning roadmap.
    
    Args:
        request: Learning roadmap request with missing skills
        
    Returns:
        Structured learning plan
    """
    try:
        if not request.missing_skills:
            raise HTTPException(status_code=400, detail="Missing skills list is required")
        
        roadmap = ai_analyzer.generate_learning_roadmap(
            request.missing_skills,
            request.current_level,
            request.target_role
        )
        
        return roadmap
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate_learning_roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Roadmap generation failed: {str(e)}")


@app.post("/api/mock-interview")
async def generate_mock_interview(request: MockInterviewRequest):
    """
    Generate resume-based mock interview questions.
    
    Args:
        request: Resume text and job description
        
    Returns:
        List of targeted interview questions with guidance
    """
    try:
        if not request.resume_text or len(request.resume_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Resume text is too short")
        
        if not request.job_description or len(request.job_description.strip()) < 50:
            raise HTTPException(status_code=400, detail="Job description is too short")
        
        questions = ai_analyzer.generate_mock_interview_questions(
            request.resume_text,
            request.job_description
        )
        
        return {"questions": questions}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in generate_mock_interview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Mock interview generation failed: {str(e)}")


@app.post("/api/voice-interview")
async def analyze_voice_answer(request: dict):
    try:
        from models import VoiceInterviewRequest
        
        result = ai_analyzer.analyze_voice_answer(
            request.get("transcript", ""),
            request.get("question", ""),
            request.get("job_description", ""),
            request.get("resume_text", "")
        )
        return result
    except Exception as e:
        print(f"Voice interview error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/consistency-check")
async def check_consistency(request: dict):
    try:
        from models import ConsistencyCheckRequest
        
        result = ai_analyzer.check_consistency(
            request.get("resume_text", ""),
            request.get("interview_answers", [])
        )
        return result
    except Exception as e:
        print(f"Consistency check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/recruiter-lens")
async def recruiter_lens(request: dict):
    try:
        from models import RecruiterLensRequest
        
        result = ai_analyzer.recruiter_lens_analysis(
            request.get("resume_text", ""),
            request.get("job_description", "")
        )
        return result
    except Exception as e:
        print(f"Recruiter lens error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/career-switch")
async def career_switch(request: dict):
    try:
        from models import CareerSwitchRequest
        
        result = ai_analyzer.career_switch_analysis(
            request.get("resume_text", ""),
            request.get("target_job", "")
        )
        return result
    except Exception as e:
        print(f"Career switch error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/whatif-simulation")
async def whatif_simulation(request: dict):
    try:
        from models import WhatIfSimulation
        
        result = ai_analyzer.simulate_whatif(
            request.get("resume_text", ""),
            request.get("job_description", ""),
            request.get("add_skills", []),
            request.get("remove_skills", []),
            request.get("add_experience", ""),
            request.get("original_score", 0)
        )
        return result
    except Exception as e:
        print(f"What-if simulation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
