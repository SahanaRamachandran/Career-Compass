import React, { useState } from 'react';
import axios from 'axios';

const CareerSwitch = ({ resumeText }) => {
  const [targetJob, setTargetJob] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSwitch = async () => {
    if (!resumeText) {
      alert('Please analyze a resume first');
      return;
    }

    if (!targetJob.trim()) {
      alert('Please enter a target job role');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/career-switch', {
        resume_text: resumeText,
        target_job: targetJob
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze career switch');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Easy') return 'text-green-600';
    if (difficulty === 'Moderate') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Career Switch Advisor</h2>
        <p className="text-gray-600 mb-6">Explore alternative career paths and transition strategies</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role
            </label>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g., Data Scientist, Product Manager, DevOps Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={analyzeSwitch}
            disabled={isLoading || !resumeText}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Career Switch'}
          </button>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-6 rounded-lg border ${analysis.is_feasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-600 mb-2">Feasibility</p>
                <p className={`text-2xl font-bold ${analysis.is_feasible ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.is_feasible ? 'Possible' : 'Challenging'}
                </p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">Skill Gap</p>
                <p className="text-2xl font-bold text-yellow-600">{analysis.gap_percentage}%</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Difficulty</p>
                <p className={`text-2xl font-bold ${getDifficultyColor(analysis.transition_difficulty)}`}>
                  {analysis.transition_difficulty}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">⏱️ Estimated Timeline</h3>
              <p className="text-2xl font-bold text-blue-600">{analysis.timeline}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>Alternative Roles (Better Match)</span>
              </h3>
              <div className="space-y-4">
                {analysis.alternative_roles.map((role, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{role.role}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        role.match_percentage >= 80 ? 'bg-green-100 text-green-800' :
                        role.match_percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {role.match_percentage}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{role.reason}</p>
                    <div className="flex flex-wrap gap-2">
                      {role.required_skills.map((skill, skillIdx) => (
                        <span key={skillIdx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                <span>Recommended Transition Path</span>
              </h3>
              <div className="space-y-3">
                {analysis.recommended_path.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSwitch;
