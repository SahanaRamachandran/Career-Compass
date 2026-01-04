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
import ResumeBuilder from './ResumeBuilder';
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
    { id: 'builder', label: 'Resume Builder', icon: '📄' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative bg-slate-900/50 backdrop-blur-md border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="gradient-text">Career Compass</span>
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">AI-Powered Career Intelligence Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex overflow-x-auto space-x-2 pb-4 border-b border-slate-800 overflow-y-visible" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap rounded-t-lg flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyze' && (
          <div className="space-y-8">
            <UploadSection 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
              analysisHistory={analysisHistory}
            />
            
            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-red-300">Error</h3>
                      <p className="text-sm text-red-200 mt-1">{error}</p>
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

        {activeTab === 'builder' && <ResumeBuilder />}

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

      <footer className="relative mt-16 bg-slate-900/30 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Built with <span className="text-red-400">❤️</span> to help you land your dream job
            </p>
            <p className="text-xs text-slate-500 mt-2">
              © 2026 Career Compass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

