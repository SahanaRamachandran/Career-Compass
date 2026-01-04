import os
from openai import OpenAI
from typing import List, Dict
import json
import re
from dotenv import load_dotenv

load_dotenv()


class AIAnalyzer:
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key not found - please add it to your .env file")
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4o-mini"
    
    def analyze_match(self, resume_text: str, job_description: str, similarity_score: float) -> Dict:
        
        example_json = '''{
  "match_percentage": 65,
  "match_explanation": "Specific explanation",
  "missing_skills": ["skill 1", "skill 2"],
  "weak_areas": ["weakness 1", "weakness 2"],
  "strengths": ["strength 1", "strength 2"],
  "ats_suggestions": ["suggestion 1", "suggestion 2"],
  "keywords_found": ["keyword 1", "keyword 2"],
  "keywords_missing": ["missing keyword"],
  "keyword_density_score": 65,
  "role_suitability": {"level": "Mid-Level", "confidence": "Medium", "reasoning": "reason"},
  "resume_sections_analysis": {
    "experience": {"score": 70, "impact": "High", "feedback": "feedback"},
    "skills": {"score": 60, "impact": "High", "feedback": "feedback"},
    "education": {"score": 75, "impact": "Medium", "feedback": "feedback"}
  },
  "bullet_point_analysis": ["observation"],
  "consistency_issues": ["issue"],
  "career_gaps": [],
  "summary": "2-sentence assessment"
}'''
        
        prompt = f"""You are an expert technical recruiter analyzing a resume against a job description. Provide a DETAILED, ACCURATE, and CRITICAL analysis.

=== RESUME ===
{resume_text[:2500]}

=== JOB DESCRIPTION ===
{job_description[:2500]}

=== INSTRUCTIONS ===

1. MATCH PERCENTAGE (0-100):
   - Compare EVERY requirement in the job description against the resume
   - 80-100: Nearly perfect match with all key requirements
   - 60-79: Good match, missing 1-2 important skills
   - 40-59: Moderate match, several gaps
   - 0-39: Poor match, major gaps
   - BE STRICT - don't inflate scores

2. KEYWORDS ANALYSIS:
   - Extract 5-10 SPECIFIC technical skills/tools from the job description
   - Mark as "found" ONLY if explicitly mentioned in resume
   - Mark as "missing" if in job but NOT in resume
   - Include: programming languages, frameworks, tools, methodologies

3. SKILLS ASSESSMENT:
   - List 3-5 SPECIFIC missing skills from the job requirements
   - List 2-3 SPECIFIC weak areas (things mentioned but underqualified)
   - List 2-3 SPECIFIC strengths (where resume exceeds requirements)

4. SECTION SCORES (0-100 each):
   - Experience: Years + relevance + depth + achievements
   - Skills: Technical breadth + depth + currency
   - Education: Degree level + field relevance + certifications

5. ATS & IMPROVEMENTS:
   - 3-4 ACTIONABLE suggestions to improve resume
   - Focus on missing keywords, formatting, quantification

Return ONLY this JSON structure (no markdown blocks):
{{
  "match_percentage": <number>,
  "match_explanation": "<specific reason for the score>",
  "missing_skills": ["skill1", "skill2", "skill3"],
  "weak_areas": ["area1", "area2"],
  "strengths": ["strength1", "strength2"],
  "ats_suggestions": ["tip1", "tip2", "tip3"],
  "keywords_found": ["keyword1", "keyword2", "keyword3"],
  "keywords_missing": ["missing1", "missing2"],
  "keyword_density_score": <number>,
  "role_suitability": {{"level": "Entry/Mid-Level/Senior/Lead", "confidence": "High/Medium/Low", "reasoning": "why this level"}},
  "resume_sections_analysis": {{
    "experience": {{"score": <number>, "impact": "High/Medium/Low", "feedback": "specific feedback"}},
    "skills": {{"score": <number>, "impact": "High/Medium/Low", "feedback": "specific feedback"}},
    "education": {{"score": <number>, "impact": "High/Medium/Low", "feedback": "specific feedback"}}
  }},
  "bullet_point_analysis": ["observation1", "observation2"],
  "consistency_issues": ["issue if any"],
  "career_gaps": [],
  "summary": "2-3 sentence honest assessment"
}}

Be CRITICAL, SPECIFIC, and ACCURATE. Base everything on actual content."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert technical recruiter with 15+ years of experience. Analyze resumes with precision and honesty. Return ONLY valid JSON with no markdown formatting."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=3000
            )
            
            content = response.choices[0].message.content.strip()
            print(f"Raw OpenAI response length: {len(content)} chars")
            
            # Remove markdown code blocks
            content = re.sub(r'^```json\s*', '', content)
            content = re.sub(r'^```\s*', '', content)
            content = re.sub(r'\s*```$', '', content)
            content = content.strip()
            
            # Try to parse directly first
            try:
                result = json.loads(content)
                print("Successfully parsed JSON")
                return result
            except json.JSONDecodeError:
                # Try to extract JSON object
                json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', content, re.DOTALL)
                if json_match:
                    try:
                        result = json.loads(json_match.group())
                        print("Successfully extracted and parsed JSON")
                        return result
                    except json.JSONDecodeError as e:
                        print(f"JSON decode error: {str(e)}")
                        print(f"Content: {content[:300]}...")
                        return self._create_fallback_analysis(similarity_score)
            
            print("No valid JSON found in response")
            return self._create_fallback_analysis(similarity_score)
                
        except Exception as e:
            print(f"Analysis error: {str(e)}")
            return self._create_fallback_analysis(similarity_score)
    
    def generate_bullet_points(self, experience: str, job_title: str) -> List[str]:
        
        prompt = f"""Transform this work experience into professional resume bullet points.

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
        match_pct = int(similarity_score * 100)
        
        return {
            "match_percentage": match_pct,
            "match_explanation": f"Analysis incomplete. Semantic match: {match_pct}%. Please retry or check your OpenAI API key.",
            "missing_skills": ["Could not extract - API error"],
            "weak_areas": ["Analysis incomplete", "Please retry with valid API key"],
            "strengths": ["Could not analyze due to API error"],
            "ats_suggestions": [
                "This is fallback data - AI analysis failed",
                "Check your OpenAI API key is valid",
                "Ensure you have API credits available"
            ],
            "keywords_found": ["Analysis", "Failed"],
            "keywords_missing": ["Check API key"],
            "keyword_density_score": match_pct,
            "role_suitability": {
                "level": "Unknown",
                "confidence": "Low",
                "reasoning": "API analysis failed - using fallback"
            },
            "resume_sections_analysis": {
                "experience": {"score": 50, "impact": "High", "feedback": "Could not analyze - API error"},
                "skills": {"score": 50, "impact": "High", "feedback": "Could not analyze - API error"},
                "education": {"score": 50, "impact": "Medium", "feedback": "Could not analyze - API error"}
            },
            "bullet_point_analysis": ["API analysis failed - check your OpenAI key"],
            "consistency_issues": ["Analysis incomplete"],
            "career_gaps": [],
            "summary": "⚠️ AI analysis failed. This is fallback data. Check your OpenAI API key and credits."
        }
    
    def analyze_voice_answer(self, transcript: str, question: str, job_desc: str, resume_text: str) -> Dict:
        prompt = f"""Analyze this interview answer for quality and alignment.

Question: {question}

Candidate's Answer: {transcript}

Job Description: {job_desc[:800]}

Resume: {resume_text[:800]}

Score the answer on:
1. Relevance (0-100): How well does it answer the question?
2. Clarity (0-100): Is it well-structured and clear?
3. Skill Alignment (0-100): Does it demonstrate required skills?

Return JSON:
{{
  "relevance_score": 85,
  "clarity_score": 90,
  "skill_alignment_score": 80,
  "overall_score": 85,
  "feedback": ["Point 1", "Point 2"],
  "improved_answer": "A better version using STAR method...",
  "follow_up_questions": ["Question 1", "Question 2"],
  "key_points_covered": ["Point 1", "Point 2"],
  "missing_points": ["What you should have mentioned"]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You're an expert interview coach."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return self._fallback_voice_analysis()
        except Exception as e:
            print(f"Voice analysis error: {str(e)}")
            return self._fallback_voice_analysis()
    
    def check_consistency(self, resume_text: str, interview_answers: List[Dict]) -> Dict:
        answers_text = "\n".join([f"Q: {a['question']}\nA: {a['answer']}" for a in interview_answers[:5]])
        
        prompt = f"""You are a HIGHLY SKEPTICAL recruiter verifying if interview answers match the resume. Be CRITICAL and THOROUGH.

=== RESUME ===
{resume_text[:2000]}

=== INTERVIEW ANSWERS ===
{answers_text}

=== DETAILED ANALYSIS INSTRUCTIONS ===

1. CHECK FOR CONTRADICTIONS:
   - Compare dates, timelines, job titles, company names
   - Compare technical skills claimed vs demonstrated
   - Compare project descriptions
   - Flag ANY inconsistency, no matter how small

2. RELEVANCE CHECK:
   - If answers discuss experiences NOT mentioned in resume = RED FLAG
   - If answers are completely unrelated to resume content = MAJOR RED FLAG
   - If answers mention technologies/skills not in resume = inconsistency

3. SCORING CRITERIA (overall_consistency 0-100):
   - 90-100: Perfect alignment, answers directly support resume
   - 70-89: Good alignment, minor discrepancies
   - 50-69: Moderate concerns, some inconsistencies
   - 30-49: Significant issues, multiple contradictions
   - 0-29: MAJOR RED FLAGS - answers don't match resume at all

4. SEVERITY LEVELS:
   - High: Contradicts major claims (job title, years, key skills)
   - Medium: Contradicts minor details or shows weak evidence
   - Low: Slight inconsistency or needs clarification

Return ONLY this JSON (no markdown):
{{
  "overall_consistency": <number 0-100>,
  "contradictions": [
    {{"claim": "Resume states: [exact claim]", "answer": "Interview states: [exact quote]", "severity": "High/Medium/Low"}}
  ],
  "weak_claims": [
    {{"claim": "Specific claim from resume", "issue": "Why interview answer doesn't support it"}}
  ],
  "areas_to_clarify": ["Specific area that needs explanation"],
  "red_flags": ["Specific red flag with explanation"]
}}

BE BRUTALLY HONEST. If answers are unrelated to resume, score should be 20-40% with clear red flags."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a skeptical recruiter with a keen eye for inconsistencies. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=2000
            )
            content = response.choices[0].message.content.strip()
            # Clean markdown if present
            content = re.sub(r'^```json\\s*', '', content)
            content = re.sub(r'^```\\s*', '', content)
            content = re.sub(r'\\s*```$', '', content)
            
            json_match = re.search(r'\\{.*\\}', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                # Ensure all required fields exist
                if 'overall_consistency' not in result:
                    result['overall_consistency'] = 50
                if 'contradictions' not in result:
                    result['contradictions'] = []
                if 'weak_claims' not in result:
                    result['weak_claims'] = []
                if 'areas_to_clarify' not in result:
                    result['areas_to_clarify'] = []
                if 'red_flags' not in result:
                    result['red_flags'] = []
                return result
            return self._fallback_consistency()
        except Exception as e:
            print(f"Consistency check error: {str(e)}")
            return self._fallback_consistency()
    
    def recruiter_lens_analysis(self, resume_text: str, job_desc: str) -> Dict:
        prompt = f"""You're a busy recruiter spending 30 seconds on this resume.

Resume: {resume_text[:1200]}

Job: {job_desc[:600]}

What catches your eye immediately? What are red flags?

Return JSON:
{{
  "first_impression_score": 75,
  "attention_grabbers": ["Impressive thing 1", "Impressive thing 2"],
  "red_flags": ["Red flag 1", "Red flag 2"],
  "missing_essentials": ["Missing thing 1"],
  "visual_appeal_score": 80,
  "time_to_decision": "20 seconds",
  "likelihood": "Would interview"
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You're a recruiter making quick decisions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=400
            )
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return self._fallback_recruiter_lens()
        except Exception as e:
            print(f"Recruiter lens error: {str(e)}")
            return self._fallback_recruiter_lens()
    
    def career_switch_analysis(self, resume_text: str, target_job: str) -> Dict:
        prompt = f"""Analyze career switch feasibility.

Current Resume: {resume_text[:1000]}

Target Job: {target_job}

Assess if this person can transition to the target role.

Return JSON:
{{
  "is_feasible": true,
  "gap_percentage": 35,
  "alternative_roles": [
    {{"role": "Role 1", "match_percentage": 85, "reason": "Why", "required_skills": ["Skill 1"]}},
    {{"role": "Role 2", "match_percentage": 75, "reason": "Why", "required_skills": ["Skill 1"]}}
  ],
  "transition_difficulty": "Moderate",
  "recommended_path": ["Step 1", "Step 2", "Step 3"],
  "timeline": "6-12 months"
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You're a career counselor."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=600
            )
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return self._fallback_career_switch()
        except Exception as e:
            print(f"Career switch error: {str(e)}")
            return self._fallback_career_switch()
    
    def simulate_whatif(self, resume_text: str, job_desc: str, add_skills: List[str], 
                        remove_skills: List[str], add_exp: str, original_score: int) -> Dict:
        modifications = []
        if add_skills:
            modifications.append(f"Adding skills: {', '.join(add_skills)}")
        if remove_skills:
            modifications.append(f"Removing skills: {', '.join(remove_skills)}")
        if add_exp:
            modifications.append(f"Adding experience: {add_exp[:200]}")
        
        prompt = f"""Predict resume match score change.

Original Resume Score: {original_score}%

Modifications: {' | '.join(modifications)}

Job Description: {job_desc[:600]}

Return JSON:
{{
  "new_score": 78,
  "score_change": 8,
  "impact_analysis": "Adding Python increases relevance...",
  "recommendations": ["Rec 1", "Rec 2"]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You're analyzing resume modifications."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=400
            )
            content = response.choices[0].message.content
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result["original_score"] = original_score
                return result
            return self._fallback_whatif(original_score)
        except Exception as e:
            print(f"What-if simulation error: {str(e)}")
            return self._fallback_whatif(original_score)
    
    def _fallback_voice_analysis(self) -> Dict:
        return {
            "relevance_score": 70,
            "clarity_score": 75,
            "skill_alignment_score": 70,
            "overall_score": 72,
            "feedback": ["Structure your answer using STAR method", "Add more specific examples"],
            "improved_answer": "Use the STAR method: Situation, Task, Action, Result. Be specific with metrics.",
            "follow_up_questions": ["Can you elaborate on that project?", "What was your specific role?"],
            "key_points_covered": ["Mentioned relevant experience"],
            "missing_points": ["Quantifiable results", "Team collaboration details"]
        }
    
    def _fallback_consistency(self) -> Dict:
        return {
            "overall_consistency": 50,
            "contradictions": [{"claim": "Unable to analyze", "answer": "API error occurred", "severity": "Medium"}],
            "weak_claims": [{"claim": "Analysis incomplete", "issue": "Could not complete AI analysis"}],
            "areas_to_clarify": ["Retry analysis - API error occurred"],
            "red_flags": ["Analysis may be inaccurate due to API error"]
        }
    
    def _fallback_recruiter_lens(self) -> Dict:
        return {
            "first_impression_score": 70,
            "attention_grabbers": ["Clear job titles", "Relevant experience"],
            "red_flags": ["Needs more quantifiable achievements"],
            "missing_essentials": ["Professional summary", "Skills section"],
            "visual_appeal_score": 75,
            "time_to_decision": "25 seconds",
            "likelihood": "Maybe interview"
        }
    
    def _fallback_career_switch(self) -> Dict:
        return {
            "is_feasible": True,
            "gap_percentage": 40,
            "alternative_roles": [
                {"role": "Related Role 1", "match_percentage": 75, "reason": "Transferable skills", "required_skills": ["Skill 1", "Skill 2"]},
                {"role": "Related Role 2", "match_percentage": 70, "reason": "Similar domain", "required_skills": ["Skill 1"]}
            ],
            "transition_difficulty": "Moderate",
            "recommended_path": ["Build missing skills", "Get certifications", "Work on portfolio projects"],
            "timeline": "6-12 months"
        }
    
    def _fallback_whatif(self, original_score: int) -> Dict:
        return {
            "original_score": original_score,
            "new_score": original_score + 5,
            "score_change": 5,
            "impact_analysis": "Modifications would slightly improve your match score.",
            "recommendations": ["Add more relevant keywords", "Quantify achievements"]
        }
