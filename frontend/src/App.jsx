import React, { useState } from 'react';
import UploadSection from './UploadSection';
import ResultsSection from './ResultsSection';
import AdvancedAnalysis from './AdvancedAnalysis';
import LearningRoadmap from './LearningRoadmap';
import MockInterview from './MockInterview';
import BulletPointGenerator from './BulletPointGenerator';
import InterviewPrep from './InterviewPrep';
import Visualizations from './Visualizations';
import VoiceInterview from './VoiceInterview';
import RecruiterLens from './RecruiterLens';
import CareerSwitch from './CareerSwitch';
import WhatIfSimulator from './WhatIfSimulator';
import ConsistencyCheck from './ConsistencyCheck';
import { analyzeResume } from './api';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const handleAnalyze = async (resumeFile, jobDesc, filename = 'resume.pdf') => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setJobDescription(jobDesc);

    try {
      const data = await analyzeResume(resumeFile, jobDesc);
      setResults(data);
      
      if (data.resume_text) {
        setResumeText(data.resume_text);
      }

      const historyRecord = {
        timestamp: new Date().toLocaleString(),
        filename: filename,
        match_score: data.match_score,
        match_percentage: data.match_percentage,
        strengths_count: data.strengths?.length || 0,
        missing_skills_count: data.missing_skills?.length || 0
      };
      setAnalysisHistory(prev => [...prev, historyRecord]);
      
    } catch (error) {
      console.error('Error analyzing resume:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to analyze resume. Please check your OpenAI API key and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'analyze', label: 'Resume Analysis', icon: '📊' },
    { id: 'voice', label: 'Voice Interview', icon: '🎤' },
    { id: 'consistency', label: 'Consistency Check', icon: '🔍' },
    { id: 'recruiter', label: 'Recruiter Lens', icon: '👁️' },
    { id: 'switch', label: 'Career Switch', icon: '🔄' },
    { id: 'whatif', label: 'What-If Simulator', icon: '🔮' },
    { id: 'visualize', label: 'Visualizations', icon: '📈' },
    { id: 'bullets', label: 'Bullet Points', icon: '✍️' },
    { id: 'interview', label: 'Interview Prep', icon: '💼' },
    { id: 'roadmap', label: 'Learning Path', icon: '🎯' },
    { id: 'mock', label: 'Mock Interview', icon: '🎭' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-blue-600">Career</span> Compass
              </h1>
              <p className="text-sm text-gray-600 mt-1">Your Personal Job Search Assistant</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyze' && (
          <div className="space-y-8">
            <UploadSection 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
              analysisHistory={analysisHistory}
            />
            
            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <>
                <ResultsSection results={results} />
                <AdvancedAnalysis results={results} />
              </>
            )}
          </div>
        )}

        {activeTab === 'voice' && (
          <VoiceInterview 
            resumeText={resumeText}
            jobDescription={jobDescription}
          />
        )}

        {activeTab === 'consistency' && (
          <ConsistencyCheck resumeText={resumeText} />
        )}

        {activeTab === 'recruiter' && (
          <RecruiterLens 
            resumeText={resumeText}
            jobDescription={jobDescription}
          />
        )}

        {activeTab === 'switch' && (
          <CareerSwitch resumeText={resumeText} />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulator 
            resumeText={resumeText}
            jobDescription={jobDescription}
            originalScore={results?.match_percentage || 0}
          />
        )}

        {activeTab === 'visualize' && (
          <Visualizations results={results} analysisHistory={analysisHistory} />
        )}

        {activeTab === 'bullets' && <BulletPointGenerator />}

        {activeTab === 'interview' && <InterviewPrep />}

        {activeTab === 'roadmap' && (
          <LearningRoadmap 
            missingSkills={results?.missing_skills || []}
            currentLevel="Mid-Level"
            targetRole={jobDescription.split('\n')[0] || 'Software Engineer'}
          />
        )}

        {activeTab === 'mock' && (
          <MockInterview 
            resumeText={resumeText}
            jobDescription={jobDescription}
          />
        )}
      </main>

      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mt-2">Made with ❤️ to help you land that dream job</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

