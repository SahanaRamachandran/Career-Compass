from pydantic import BaseModel
from typing import List, Optional, Dict


class JobDescriptionInput(BaseModel):
    """Job description input model."""
    text: str


class RoleSuitability(BaseModel):
    """Role suitability assessment."""
    level: str
    confidence: str
    reasoning: str

class SectionAnalysis(BaseModel):
    """Analysis of a resume section."""
    score: int
    impact: str
    feedback: str

class AnalysisResponse(BaseModel):
    """Response model for resume analysis with advanced features."""
    match_score: float
    match_percentage: int
    match_explanation: str
    missing_skills: List[str]
    weak_areas: List[str]
    strengths: List[str]
    ats_suggestions: List[str]
    keywords_found: List[str]
    keywords_missing: List[str]
    keyword_density_score: int
    role_suitability: RoleSuitability
    resume_sections_analysis: Dict[str, SectionAnalysis]
    bullet_point_analysis: List[str]
    consistency_issues: List[str]
    career_gaps: List[str]
    summary: str
    resume_text: str
    job_description: str

class LearningRoadmapRequest(BaseModel):
    """Request for learning roadmap generation."""
    missing_skills: List[str]
    current_level: str
    target_role: str

class MockInterviewRequest(BaseModel):
    """Request for mock interview questions."""
    resume_text: str
    job_description: str


class BulletPointRequest(BaseModel):
    """Request for generating bullet points."""
    experience: str
    job_title: str


class BulletPointResponse(BaseModel):
    """Response with generated bullet points."""
    bullet_points: List[str]


class InterviewQuestionsResponse(BaseModel):
    """Response with interview questions."""
    questions: List[str]


class AnalysisHistory(BaseModel):
    """Historical analysis record."""
    timestamp: str
    filename: str
    match_score: float
    match_percentage: int
    strengths_count: int
    missing_skills_count: int


class ATSOptimizationResponse(BaseModel):
    """ATS optimization analysis."""
    ats_score: int
    is_ats_friendly: bool
    issues: List[str]
    recommendations: List[str]
    keyword_optimization: Dict[str, any]
    formatting_issues: List[str]


class RoleSuggestion(BaseModel):
    """Job role suggestion."""
    role: str
    match_percentage: int
    reason: str
    required_skills: List[str]


class SkillGapDetail(BaseModel):
    """Detailed skill gap information."""
    skill: str
    importance: str
    current_level: str
    target_level: str
    learning_resources: List[str]


class ExportReportRequest(BaseModel):
    """Request for report export."""
    format: str  # 'pdf' or 'csv'
    analysis_data: Dict
