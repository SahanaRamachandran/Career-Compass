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
