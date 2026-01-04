import React, { useState } from 'react';
import axios from 'axios';

const RecruiterLens = ({ resumeText, jobDescription }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please analyze a resume first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/recruiter-lens', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">👁️ Recruiter Lens Mode</h2>
        <p className="text-slate-400 mb-6">See what a recruiter notices in the first 30 seconds</p>

        <button
          onClick={analyzeResume}
          disabled={isLoading || !resumeText}
          className="btn-primary disabled:opacity-50 mb-6"
        >
          {isLoading ? 'Analyzing...' : 'Analyze from Recruiter Perspective'}
        </button>

        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                <p className="text-sm text-slate-400 mb-2">First Impression</p>
                <p className={`text-4xl font-bold ${getScoreColor(analysis.first_impression_score)}`}>
                  {analysis.first_impression_score}
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                <p className="text-sm text-slate-400 mb-2">Visual Appeal</p>
                <p className={`text-4xl font-bold ${getScoreColor(analysis.visual_appeal_score)}`}>
                  {analysis.visual_appeal_score}
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-500/30">
                <p className="text-sm text-slate-400 mb-2">Decision Time</p>
                <p className="text-2xl font-bold text-slate-200">{analysis.time_to_decision}</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-lg">
              <h3 className="font-bold text-xl text-slate-200 mb-2">⚡ Decision</h3>
              <p className="text-lg text-slate-300 font-semibold">{analysis.likelihood}</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span>What Caught Their Eye</span>
              </h3>
              <div className="space-y-2">
                {analysis.attention_grabbers.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>Red Flags</span>
              </h3>
              {analysis.red_flags.length > 0 ? (
                <div className="space-y-2">
                  {analysis.red_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-slate-300">{flag}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No major red flags detected</p>
              )}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <span>Missing Essentials</span>
              </h3>
              {analysis.missing_essentials.length > 0 ? (
                <div className="space-y-2">
                  {analysis.missing_essentials.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">All essential elements present</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterLens;
