import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description', jobDescription);

  const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const generateBulletPoints = async (experience, jobTitle) => {
  const response = await axios.post(`${API_BASE_URL}/api/bullet-points`, {
    experience,
    job_title: jobTitle,
  });

  return response.data;
};

export const getInterviewQuestions = async (jobDescription) => {
  const response = await axios.post(`${API_BASE_URL}/api/interview-questions`, {
    text: jobDescription,
  });

  return response.data;
};

export const getLearningRoadmap = async (missingSkills, currentLevel, targetRole) => {
  const response = await axios.post(`${API_BASE_URL}/api/learning-roadmap`, {
    missing_skills: missingSkills,
    current_level: currentLevel,
    target_role: targetRole,
  });

  return response.data;
};

export const getMockInterview = async (resumeText, jobDescription) => {
  const response = await axios.post(`${API_BASE_URL}/api/mock-interview`, {
    resume_text: resumeText,
    job_description: jobDescription,
  });

  return response.data;
};

export const analyzeVoiceAnswer = async (transcript, question, jobDescription, resumeText) => {
  const response = await axios.post(`${API_BASE_URL}/api/voice-interview`, {
    transcript,
    question,
    job_description: jobDescription,
    resume_text: resumeText,
  });

  return response.data;
};

export const checkConsistency = async (resumeText, interviewAnswers) => {
  const response = await axios.post(`${API_BASE_URL}/api/consistency-check`, {
    resume_text: resumeText,
    interview_answers: interviewAnswers,
  });

  return response.data;
};

export const getRecruiterLens = async (resumeText, jobDescription) => {
  const response = await axios.post(`${API_BASE_URL}/api/recruiter-lens`, {
    resume_text: resumeText,
    job_description: jobDescription,
  });

  return response.data;
};

export const analyzeCareerSwitch = async (resumeText, targetJob) => {
  const response = await axios.post(`${API_BASE_URL}/api/career-switch`, {
    resume_text: resumeText,
    target_job: targetJob,
  });

  return response.data;
};

export const simulateWhatIf = async (resumeText, jobDescription, addSkills, removeSkills, addExperience, originalScore) => {
  const response = await axios.post(`${API_BASE_URL}/api/whatif-simulation`, {
    resume_text: resumeText,
    job_description: jobDescription,
    add_skills: addSkills,
    remove_skills: removeSkills,
    add_experience: addExperience,
    original_score: originalScore,
  });

  return response.data;
};
