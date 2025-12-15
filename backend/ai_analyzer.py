import os
from openai import OpenAI
from typing import List, Dict
import json
import re
from dotenv import load_dotenv

load_dotenv()


class AIAnalyzer:
    """Use OpenAI GPT to analyze resume-job fit and provide insights."""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-3.5-turbo"
    
    def analyze_match(self, resume_text: str, job_description: str, similarity_score: float) -> Dict:
        """
        Analyze resume-job match and provide detailed insights with advanced features.
        
        Args:
            resume_text: Resume content
            job_description: Job description content
            similarity_score: Cosine similarity score
            
        Returns:
            Dictionary with comprehensive analysis results
        """
        prompt = f"""You are an expert career advisor and ATS specialist analyzing resume-job fit.

Resume:
{resume_text[:3000]}

Job Description:
{job_description[:2000]}

Semantic similarity score: {similarity_score:.2f} (0-1 scale)

Provide a comprehensive analysis in JSON format with these fields:
{{
  "match_percentage": <0-100 integer>,
  "match_explanation": "2-3 sentences explaining why this score was given",
  "missing_skills": ["skill1", "skill2", "skill3"],
  "weak_areas": ["area1", "area2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "ats_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "keywords_found": ["keyword1", "keyword2"],
  "keywords_missing": ["keyword1", "keyword2"],
  "keyword_density_score": <0-100 integer>,
  "role_suitability": {{"level": "Junior/Mid/Senior/Lead", "confidence": "High/Medium/Low", "reasoning": "brief explanation"}},
  "resume_sections_analysis": {{
    "experience": {{"score": <0-100>, "impact": "High/Medium/Low", "feedback": "brief comment"}},
    "skills": {{"score": <0-100>, "impact": "High/Medium/Low", "feedback": "brief comment"}},
    "education": {{"score": <0-100>, "impact": "Medium/Low", "feedback": "brief comment"}}
  }},
  "bullet_point_analysis": ["Strong action verb usage", "Lacks quantifiable metrics", "Good specificity"],
  "consistency_issues": ["Inconsistent date formats", "Varying bullet styles"],
  "career_gaps": ["Gap detected: May 2020 - Aug 2020"],
  "summary": "Brief overall assessment"
}}

Be specific and actionable."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert career advisor and ATS specialist."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                return result
            else:
                # Fallback
                return self._create_fallback_analysis(similarity_score)
                
        except Exception as e:
            print(f"AI Analysis error: {str(e)}")
            return self._create_fallback_analysis(similarity_score)
    
    def generate_bullet_points(self, experience: str, job_title: str) -> List[str]:
        """
        Generate improved resume bullet points based on experience.
        
        Args:
            experience: User's experience description
            job_title: Target job title
            
        Returns:
            List of improved bullet points
        """
        prompt = f"""Generate 8-10 diverse, powerful resume bullet points for this experience:

Experience: {experience[:800]}
Target Role: {job_title}

Create a variety of bullet points that showcase different aspects:
1. Achievement-focused (with metrics and impact)
2. Leadership/collaboration bullets
3. Technical skills implementation
4. Process improvement examples
5. Problem-solving scenarios
6. Innovation/initiative examples

Requirements for EACH bullet:
- Start with powerful action verbs (Led, Architected, Spearheaded, Optimized, etc.)
- Include specific metrics, percentages, or timeframes where possible
- Be concrete and specific (not vague)
- Use ATS-friendly keywords for {job_title}
- Keep each to 1-2 lines maximum
- Vary the structure and focus

Return ONLY the bullet points, one per line, without numbers, dashes, or bullet symbols."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume writer who creates powerful, ATS-optimized bullet points with strong action verbs and quantifiable achievements."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=600
            )
            
            content = response.choices[0].message.content.strip()
            # Clean and extract bullet points
            bullet_points = []
            for line in content.split('\n'):
                line = line.strip()
                # Remove any numbering, bullets, or dashes
                line = re.sub(r'^[\d\.\-•*]+\s*', '', line)
                if line and len(line) > 20:  # Filter out too short lines
                    bullet_points.append(line)
            
            return bullet_points[:10] if len(bullet_points) > 0 else self._create_fallback_bullets()
            
        except Exception as e:
            print(f"Bullet point generation error: {str(e)}")
            return self._create_fallback_bullets()
    
    def _create_fallback_bullets(self) -> List[str]:
        """Create comprehensive fallback bullets when AI call fails."""
        return [
            "Spearheaded cross-functional initiatives that improved team productivity by 25% and reduced delivery time",
            "Architected and implemented scalable solutions serving 100K+ users with 99.9% uptime",
            "Led team of 5 engineers in delivering critical features, resulting in 30% increase in user engagement",
            "Optimized system performance by refactoring legacy codebase, achieving 40% faster load times",
            "Collaborated with product and design teams to launch 3 major features ahead of schedule",
            "Mentored junior developers through code reviews and pair programming sessions",
            "Automated manual processes using Python scripts, saving 10 hours per week",
            "Presented technical solutions to stakeholders and secured buy-in for strategic initiatives"
        ]
    
    def generate_interview_questions(self, job_description: str) -> List[str]:
        """
        Generate role-specific interview questions.
        
        Args:
            job_description: Job description content
            
        Returns:
            List of interview questions
        """
        prompt = f"""Based on this job description, generate 5 relevant interview questions a candidate should prepare for:

Job Description:
{job_description[:1500]}

Generate questions that cover:
1. Technical skills
2. Behavioral scenarios
3. Role-specific challenges
4. Company fit

Return only the questions, one per line, numbered."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an experienced technical recruiter."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=400
            )
            
            content = response.choices[0].message.content.strip()
            # Clean up numbered questions
            questions = []
            for line in content.split('\n'):
                line = line.strip()
                if line:
                    # Remove numbering
                    cleaned = re.sub(r'^\d+[\.\)]\s*', '', line)
                    if cleaned:
                        questions.append(cleaned)
            
            return questions[:5]
            
        except Exception as e:
            print(f"Interview questions generation error: {str(e)}")
            return [
                "Can you describe a challenging project you worked on and how you overcame obstacles?",
                "How do you stay current with industry trends and technologies?",
                "Describe a time when you had to work with a difficult team member.",
                "What interests you most about this role and our company?",
                "Where do you see yourself in 3-5 years?"
            ]
    
    def generate_learning_roadmap(self, missing_skills: List[str], current_level: str, target_role: str) -> Dict:
        """
        Generate a personalized 30-60-90 day learning roadmap.
        
        Args:
            missing_skills: List of skills to acquire
            current_level: Current experience level
            target_role: Target job role
            
        Returns:
            Dictionary with structured learning plan
        """
        skills_str = ", ".join(missing_skills[:5])
        prompt = f"""Create a focused 30-60-90 day learning roadmap for someone at {current_level} level targeting a {target_role} role.

Missing Skills: {skills_str}

Provide a practical plan in JSON format:
{{
  "days_0_30": {{
    "focus": "Foundation building",
    "skills": ["skill1", "skill2"],
    "resources": ["Online course", "Documentation"],
    "projects": ["Small project idea"],
    "milestones": ["Milestone 1", "Milestone 2"]
  }},
  "days_31_60": {{
    "focus": "Intermediate practice",
    "skills": ["skill3", "skill4"],
    "resources": ["Advanced tutorial", "Practice platform"],
    "projects": ["Medium project idea"],
    "milestones": ["Milestone 1", "Milestone 2"]
  }},
  "days_61_90": {{
    "focus": "Advanced application",
    "skills": ["skill5", "integration"],
    "resources": ["Real-world examples", "Community"],
    "projects": ["Portfolio project idea"],
    "milestones": ["Milestone 1", "Milestone 2"]
  }},
  "weekly_time_commitment": "10-15 hours",
  "success_metrics": ["Metric 1", "Metric 2"]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a career development coach."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return self._create_fallback_roadmap()
        except Exception as e:
            print(f"Roadmap generation error: {str(e)}")
            return self._create_fallback_roadmap()
    
    def generate_mock_interview_questions(self, resume_text: str, job_description: str) -> List[Dict]:
        """
        Generate resume-based mock interview questions.
        
        Args:
            resume_text: Resume content
            job_description: Job description
            
        Returns:
            List of questions with follow-ups
        """
        prompt = f"""Based on this resume and job description, generate 6 targeted interview questions.

Resume highlights:
{resume_text[:1500]}

Job Description:
{job_description[:1500]}

For each question, provide detailed guidance.

Format as JSON array:
[
  {{
    "question": "The interview question",
    "category": "Technical/Behavioral/Situational",
    "difficulty": "Easy/Medium/Hard",
    "why_asked": "Brief explanation of why interviewers ask this",
    "key_points": ["Point 1 to cover", "Point 2 to cover", "Point 3 to cover"],
    "sample_answer": "A brief sample answer approach using STAR method",
    "red_flags": ["Red flag 1 to avoid", "Red flag 2 to avoid"]
  }}
]"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an experienced technical recruiter and interview coach who creates targeted, thoughtful interview questions with detailed guidance."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            content = response.choices[0].message.content
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                questions = json.loads(json_match.group())
                # Ensure all required fields are present
                for q in questions:
                    if 'difficulty' not in q:
                        q['difficulty'] = 'Medium'
                    if 'key_points' not in q:
                        q['key_points'] = []
                    if 'sample_answer' not in q:
                        q['sample_answer'] = ''
                    if 'red_flags' not in q:
                        q['red_flags'] = []
                return questions
            else:
                print("Could not parse JSON from response")
                return self._create_fallback_questions()
        except json.JSONDecodeError as e:
            print(f"JSON parsing error in mock questions: {str(e)}")
            return self._create_fallback_questions()
        except Exception as e:
            print(f"Mock questions generation error: {str(e)}")
            return self._create_fallback_questions()
    
    def _create_fallback_roadmap(self) -> Dict:
        """Create a basic roadmap when AI call fails."""
        return {
            "days_0_30": {
                "focus": "Foundation building",
                "skills": ["Core concepts", "Basic tools"],
                "resources": ["Online tutorials", "Documentation"],
                "projects": ["Simple practice projects"],
                "milestones": ["Complete 2-3 tutorials", "Build first project"]
            },
            "days_31_60": {
                "focus": "Skill development",
                "skills": ["Intermediate concepts", "Practical application"],
                "resources": ["Advanced courses", "Practice platforms"],
                "projects": ["Medium-sized projects"],
                "milestones": ["Complete 2 projects", "Contribute to open source"]
            },
            "days_61_90": {
                "focus": "Portfolio building",
                "skills": ["Advanced topics", "Best practices"],
                "resources": ["Industry blogs", "GitHub repositories"],
                "projects": ["Portfolio-worthy project"],
                "milestones": ["Polished portfolio", "Ready for interviews"]
            },
            "weekly_time_commitment": "10-15 hours",
            "success_metrics": ["Projects completed", "Skills acquired"]
        }
    
    def _create_fallback_questions(self) -> List[Dict]:
        """Create basic mock questions when AI call fails."""
        return [
            {
                "question": "Tell me about a challenging project you worked on and how you overcame obstacles.",
                "category": "Behavioral",
                "difficulty": "Medium",
                "why_asked": "To assess problem-solving skills and resilience",
                "key_points": ["Describe the challenge clearly", "Explain your approach", "Quantify the results"],
                "sample_answer": "Use the STAR method: Situation - describe the challenge, Task - your responsibility, Action - steps you took, Result - the outcome with metrics",
                "red_flags": ["Blaming others for failures", "Being vague about your role"]
            },
            {
                "question": "How do you prioritize tasks when working on multiple projects?",
                "category": "Behavioral",
                "difficulty": "Medium",
                "why_asked": "To evaluate time management and organizational skills",
                "key_points": ["Explain your prioritization framework", "Mention tools you use", "Give a specific example"],
                "sample_answer": "Describe your method (e.g., Eisenhower matrix, deadline-driven) and provide a real example of managing competing priorities",
                "red_flags": ["Saying you never struggle with priorities", "Not having a clear method"]
            },
            {
                "question": "Describe a technical skill you recently learned. How did you approach the learning process?",
                "category": "Technical",
                "difficulty": "Easy",
                "why_asked": "To assess learning agility and self-improvement mindset",
                "key_points": ["Name the skill and why you learned it", "Describe your learning approach", "Share how you applied it"],
                "sample_answer": "Pick a recent skill relevant to the role, explain your learning resources, and share a project where you applied it",
                "red_flags": ["Choosing an irrelevant skill", "Not showing practical application"]
            }
        ]
    
    def _create_fallback_analysis(self, similarity_score: float) -> Dict:
        """Create a basic analysis when AI call fails."""
        match_pct = int(similarity_score * 100)
        
        return {
            "match_percentage": match_pct,
            "match_explanation": f"Your resume shows a {match_pct}% semantic match with the job requirements.",
            "missing_skills": ["Specific technical skills from job description"],
            "weak_areas": ["Quantifiable achievements", "Keyword optimization"],
            "strengths": ["Relevant experience", "Clear communication"],
            "ats_suggestions": [
                "Add more keywords from the job description",
                "Include quantifiable metrics and achievements",
                "Use standard section headings (Experience, Education, Skills)"
            ],
            "keywords_found": ["Experience", "Skills"],
            "keywords_missing": ["Specific job keywords"],
            "keyword_density_score": match_pct,
            "role_suitability": {
                "level": "Mid-Level",
                "confidence": "Medium",
                "reasoning": "Based on experience shown"
            },
            "resume_sections_analysis": {
                "experience": {"score": match_pct, "impact": "High", "feedback": "Good experience section"},
                "skills": {"score": match_pct - 10, "impact": "High", "feedback": "Add more relevant skills"},
                "education": {"score": 75, "impact": "Medium", "feedback": "Education section present"}
            },
            "bullet_point_analysis": ["Review bullet points for action verbs", "Add quantifiable metrics"],
            "consistency_issues": ["Check formatting consistency"],
            "career_gaps": [],
            "summary": f"Your resume has a {match_pct}% match. Focus on incorporating more specific keywords and achievements."
        }
