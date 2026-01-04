import React, { useState } from 'react';
import axios from 'axios';

const WhatIfSimulator = ({ resumeText, jobDescription, originalScore }) => {
  const [addSkills, setAddSkills] = useState('');
  const [removeSkills, setRemoveSkills] = useState('');
  const [addExperience, setAddExperience] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runSimulation = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please analyze a resume first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/whatif-simulation', {
        resume_text: resumeText,
        job_description: jobDescription,
        add_skills: addSkills.split(',').map(s => s.trim()).filter(s => s),
        remove_skills: removeSkills.split(',').map(s => s.trim()).filter(s => s),
        add_experience: addExperience,
        original_score: originalScore || 0
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to run simulation');
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">🔮 What-If Resume Simulator</h2>
        <p className="text-slate-400 mb-6">Test how changes to your resume would affect your match score</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Add Skills (comma-separated)
            </label>
            <input
              type="text"
              value={addSkills}
              onChange={(e) => setAddSkills(e.target.value)}
              placeholder="e.g., Python, Machine Learning, AWS"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Remove Skills (comma-separated)
            </label>
            <input
              type="text"
              value={removeSkills}
              onChange={(e) => setRemoveSkills(e.target.value)}
              placeholder="e.g., Legacy tech, outdated skills"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Add Experience
            </label>
            <textarea
              value={addExperience}
              onChange={(e) => setAddExperience(e.target.value)}
              placeholder="Describe new experience, projects, or achievements you'd like to add..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={runSimulation}
            disabled={isLoading || !resumeText}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <p className="text-sm text-slate-400 mb-2">Original Score</p>
                <p className="text-4xl font-bold text-blue-400">{result.original_score}%</p>
              </div>
              <div className="text-center p-6 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <p className="text-sm text-slate-400 mb-2">New Score</p>
                <p className="text-4xl font-bold text-purple-400">{result.new_score}%</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                <p className="text-sm text-slate-400 mb-2">Change</p>
                <p className={`text-4xl font-bold ${getChangeColor(result.score_change)}`}>
                  {getChangeIcon(result.score_change)} {Math.abs(result.score_change)}%
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border-2 border-purple-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span>Impact Analysis</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">{result.impact_analysis}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <span>Recommendations</span>
              </h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {result.score_change > 0 && (
              <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-green-400">Great Choice!</h4>
                    <p className="text-green-300">These changes would improve your match score. Consider implementing them in your actual resume.</p>
                  </div>
                </div>
              </div>
            )}

            {result.score_change < 0 && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-red-400">Not Recommended</h4>
                    <p className="text-red-300">These changes would decrease your match score. Consider alternative modifications.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
