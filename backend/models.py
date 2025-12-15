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
    current_level: int
    target_level: int
    learning_time: str


class VoiceInterviewRequest(BaseModel):
    transcript: str
    question: str
    job_description: str
    resume_text: str


class VoiceInterviewResponse(BaseModel):
    relevance_score: int
    clarity_score: int
    skill_alignment_score: int
    overall_score: int
    feedback: List[str]
    improved_answer: str
    follow_up_questions: List[str]
    key_points_covered: List[str]
    missing_points: List[str]


class ConsistencyCheckRequest(BaseModel):
    resume_text: str
    interview_answers: List[Dict[str, str]]


class ConsistencyCheckResponse(BaseModel):
    overall_consistency: int
    contradictions: List[Dict[str, str]]
    weak_claims: List[Dict[str, str]]
    areas_to_clarify: List[str]
    red_flags: List[str]


class RecruiterLensRequest(BaseModel):
    resume_text: str
    job_description: str


class RecruiterLensResponse(BaseModel):
    first_impression_score: int
    attention_grabbers: List[str]
    red_flags: List[str]
    missing_essentials: List[str]
    visual_appeal_score: int
    time_to_decision: str
    likelihood: str


class CareerSwitchRequest(BaseModel):
    resume_text: str
    target_job: str


class CareerSwitchResponse(BaseModel):
    is_feasible: bool
    gap_percentage: int
    alternative_roles: List[RoleSuggestion]
    transition_difficulty: str
    recommended_path: List[str]
    timeline: str


class WhatIfSimulation(BaseModel):
    resume_text: str
    job_description: str
    add_skills: List[str] = []
    remove_skills: List[str] = []
    add_experience: str = ""


class WhatIfResponse(BaseModel):
    original_score: int
    new_score: int
    score_change: int
    impact_analysis: str
    recommendations: List[str]
    skill: str
    importance: str
    current_level: str
    target_level: str
    learning_resources: List[str]


class ExportReportRequest(BaseModel):
    """Request for report export."""
    format: str  # 'pdf' or 'csv'
    analysis_data: Dict
